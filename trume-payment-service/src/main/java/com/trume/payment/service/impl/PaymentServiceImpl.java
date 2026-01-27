package com.trume.payment.service.impl;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trume.payment.dto.PaymentCreateRequestDto;
import com.trume.payment.dto.PaymentResponseDto;
import com.trume.payment.dto.PaymentStatusUpdateRequestDto;
import com.trume.payment.dto.StripeCheckoutResponse;
import com.trume.payment.entity.Payment;
import com.trume.payment.entity.enums.PaymentMethod;
import com.trume.payment.entity.enums.PaymentStatus;
import com.trume.payment.exception.payment.DuplicatePaymentException;
import com.trume.payment.exception.payment.InvalidPaymentStatusException;
import com.trume.payment.exception.payment.InvalidPaymentStatusTransitionException;
import com.trume.payment.exception.payment.PaymentNotFoundException;
import com.trume.payment.repository.PaymentRepository;
import com.trume.payment.service.PaymentService;
import com.trume.payment.service.StripeCheckoutService;

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

	@Override
	public PaymentResponseDto createPayment(PaymentCreateRequestDto request) {

		// 0️ Basic validation
		if (request.getOrderId() == null || request.getAmount() == null) {
			throw new InvalidPaymentStatusException(
					"orderId and amount must not be null");
		}

		// 1️ Generate idempotency key if missing
		String idempotencyKey = request.getIdempotencyKey();
		if (idempotencyKey == null || idempotencyKey.isBlank()) {
			idempotencyKey = "payment-" + request.getOrderId();
			log.warn(
					"Idempotency key not provided, generated default={}",
					idempotencyKey);
		}

		log.info(
				"Creating payment | orderId={} | idempotencyKey={}",
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
		StripeCheckoutResponse stripeResponse =
				stripeCheckoutService.createCheckoutSession(
						request.getOrderId(),
						request.getAmount(),
						request.getCurrency()
						);

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

		return response;
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
					newStatus
					);

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

		return modelMapper.map(updatedPayment, PaymentResponseDto.class);
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




}
