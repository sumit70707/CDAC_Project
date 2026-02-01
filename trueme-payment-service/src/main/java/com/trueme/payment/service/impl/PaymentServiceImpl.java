package com.trueme.payment.service.impl;

import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.payment.client.OrderClient;
import com.trueme.payment.dto.OrderPaymentStatusUpdateRequestDto;
import com.trueme.payment.dto.PaymentCreateRequestDto;
import com.trueme.payment.dto.PaymentEventDto;
import com.trueme.payment.dto.PaymentResponseDto;
import com.trueme.payment.dto.PaymentStatusUpdateRequestDto;
import com.trueme.payment.dto.StripeCheckoutResponseDto;
import com.trueme.payment.entity.Payment;
import com.trueme.payment.entity.enums.PaymentMethod;
import com.trueme.payment.entity.enums.PaymentStatus;
import com.trueme.payment.entity.enums.PaymentStatusFromPaymentService;
import com.trueme.payment.exception.payment.DuplicatePaymentException;
import com.trueme.payment.exception.payment.InvalidPaymentStatusException;
import com.trueme.payment.exception.payment.InvalidPaymentStatusTransitionException;
import com.trueme.payment.exception.payment.PaymentNotFoundException;
import com.trueme.payment.kafka.PaymentNotificationProducer;
import com.trueme.payment.repository.PaymentRepository;
import com.trueme.payment.service.PaymentService;
import com.trueme.payment.service.StripeCheckoutService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

	private final PaymentRepository paymentRepository;
	private final StripeCheckoutService stripeCheckoutService;
	private final ModelMapper modelMapper;
	private final OrderClient orderClient;
	private final PaymentNotificationProducer paymentNotificationProducer;
	private static String orderNumber;

	@Override
	public PaymentResponseDto createPayment(PaymentCreateRequestDto request) {

		// 0️ Basic validation
		if (request.getOrderId() == null || request.getAmount() == null) {
			throw new InvalidPaymentStatusException(
					"orderId and amount must not be null");
		}

		// 1️ Generate idempotency key if missing
		String uuid = UUID.randomUUID().toString();
		String idempotencyKey = "payment-" + request.getOrderId()+uuid;

		log.warn("Idempotency key generated default={}",idempotencyKey);


		log.info("Creating payment | orderId={} | idempotencyKey={}",
				request.getOrderId(),idempotencyKey);

		// 2️Duplicate payment check 
		Optional<Payment> existingPayment =
				paymentRepository.findByOrderIdAndIdempotencyKey(
						request.getOrderId(),idempotencyKey );

		if (existingPayment.isPresent()) {
			log.warn(
					"Duplicate payment request | orderId={} | paymentId={}",
					request.getOrderId(), existingPayment.get().getId());
			throw new DuplicatePaymentException(request.getOrderId());
		}

		// 3️ Create Stripe Checkout Session
		StripeCheckoutResponseDto stripeResponse =
				stripeCheckoutService.createCheckoutSession(
						request.getOrderNumber(),
						request.getAmount(),
						request.getCurrency());

		// 4️ Create Payment entity
		Payment payment = Payment.builder()
				.orderId(request.getOrderId())
				.amount(request.getAmount())
				.currency(
						request.getCurrency() != null
						? request.getCurrency()
								: "INR" )
				.stripePaymentId(stripeResponse.getSessionId())
				.idempotencyKey(idempotencyKey)
				.status(PaymentStatus.PROCESSING)
				.method(PaymentMethod.CARD)
				.build();

		Payment savedPayment = paymentRepository.save(payment);

		log.info(
				"Payment created successfully | paymentId={} | stripePaymentId={}",
				savedPayment.getId(),savedPayment.getStripePaymentId());

		// 5️ Prepare response
		PaymentResponseDto response =
				modelMapper.map(savedPayment, PaymentResponseDto.class);

		response.setCheckoutUrl(stripeResponse.getCheckoutUrl());

		//for updateMethod
		orderNumber=request.getOrderNumber();

		return response;
	}

	@Override
	public PaymentStatus cancelPayment(String stripePaymentId) {

		log.warn("Cancelling payment | stripePaymentId={}", stripePaymentId);

		Payment payment = paymentRepository
				.findByStripePaymentId(stripePaymentId)
				.orElseThrow(() -> {
					log.error(
							"Payment not found for cancel | stripePaymentId={}",
							stripePaymentId
							);
					return new PaymentNotFoundException(stripePaymentId);
				});

		PaymentStatus currentStatus = payment.getStatus();

		// Idempotent case: already canceled
		if (currentStatus == PaymentStatus.CANCELED) {
			log.info(
					"Payment already canceled | paymentId={}",
					payment.getId()
					);
			return PaymentStatus.CANCELED;
		}

		// Invalid transition
		if (currentStatus == PaymentStatus.SUCCEEDED) {
			log.warn(
					"Attempt to cancel a successful payment | paymentId={}",
					payment.getId()
					);
			throw new InvalidPaymentStatusTransitionException(
					currentStatus,
					PaymentStatus.CANCELED
					);
		}

		// Only PROCESSING can be canceled
		if (currentStatus != PaymentStatus.PROCESSING) {
			throw new InvalidPaymentStatusTransitionException(
					currentStatus,
					PaymentStatus.CANCELED
					);
		}

		// Valid cancel
		payment.setStatus(PaymentStatus.CANCELED);
		paymentRepository.save(payment);

		log.info(
				"Payment canceled successfully | paymentId={}",
				payment.getId()
				);

		return PaymentStatus.CANCELED;
	}


	@Override
	public PaymentResponseDto updatePaymentStatus(
			PaymentStatusUpdateRequestDto request) {

		// Basic validation (PAY_400)
		if (request.getStripePaymentId() == null || request.getStatus() == null) {
			throw new InvalidPaymentStatusException(
					"stripePaymentId and status must not be null");
		}

		log.info(
				"Updating payment status | stripePaymentId={} | newStatus={}",
				request.getStripePaymentId(), request.getStatus() );

		// 1️ Fetch payment 
		Payment payment = paymentRepository
				.findByStripePaymentId(request.getStripePaymentId())
				.orElseThrow(() -> {
					log.error(
							"Payment not found | stripePaymentId={}",
							request.getStripePaymentId());
					return new PaymentNotFoundException(
							request.getStripePaymentId());
				});

		// 2️ Read new status directly (enum already validated by Jackson)
		PaymentStatus newStatus = request.getStatus();

		// 3️ Current status from DB
		PaymentStatus currentStatus = payment.getStatus();


		// 3️ Idempotent behavior
		if (currentStatus == newStatus) {
			log.info(
					"Payment already in status={} | paymentId={}",
					currentStatus,
					payment.getId());
			return modelMapper.map(payment, PaymentResponseDto.class);
		}

		// 4️ Terminal state protection 
		if (currentStatus == PaymentStatus.SUCCEEDED ||
				currentStatus == PaymentStatus.CANCELED) {

			log.warn(
					"Invalid status transition | paymentId={} | from={} | to={}",
					payment.getId(),
					currentStatus,
					newStatus);

			throw new InvalidPaymentStatusTransitionException(
					currentStatus,newStatus);
		}

		// 5️ Allowed transitions
		if (currentStatus == PaymentStatus.PROCESSING &&
				(newStatus == PaymentStatus.SUCCEEDED ||
				newStatus == PaymentStatus.CANCELED)) {

			payment.setStatus(newStatus);

		} else {
			log.warn(
					"Invalid status transition | paymentId={} | from={} | to={}",
					payment.getId(),currentStatus,newStatus);
			throw new InvalidPaymentStatusTransitionException(
					currentStatus,newStatus);
		}

		Payment updatedPayment = paymentRepository.save(payment);

		log.info(
				"Payment status updated | paymentId={} | status={}",
				updatedPayment.getId(),updatedPayment.getStatus());

		//produce Event

		paymentNotificationProducer.publishOrderEvent(
				new PaymentEventDto(
						updatedPayment.getOrderId(),
						orderNumber,
						updatedPayment.getStripePaymentId(),
						updatedPayment.getAmount(),
						updatedPayment.getStatus())
				);

		//////update order status here

		notifyOrderService(updatedPayment);

		return modelMapper.map(updatedPayment, PaymentResponseDto.class);
	}

	private void notifyOrderService(Payment payment) {

		// We notify Order Service ONLY for final states
		PaymentStatus status = payment.getStatus();

		if (status != PaymentStatus.SUCCEEDED &&
				status != PaymentStatus.CANCELED &&
				status != PaymentStatus.FAILED) {
			return;
		}


		// Map payment-service status → order-service contract enum
		//else coverss  FAILED and CANCELED
		PaymentStatusFromPaymentService orderPaymentStatus =
				(status == PaymentStatus.SUCCEEDED)
				? PaymentStatusFromPaymentService.COMPLETED
						: PaymentStatusFromPaymentService.FAILED;

		log.info(
				"Notifying Order Service | orderId={} | paymentStatus={}",
				payment.getOrderId(),
				orderPaymentStatus);

		orderClient.updateOrderPaymentStatus(
				new OrderPaymentStatusUpdateRequestDto(
						payment.getOrderId(),
						payment.getId(),
						orderPaymentStatus)
				);
	}





}
