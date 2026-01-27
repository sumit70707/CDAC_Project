package com.trume.payment.service.impl;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.trume.payment.dto.StripeCheckoutResponse;
import com.trume.payment.exception.payment.StripeCheckoutException;
import com.trume.payment.service.StripeCheckoutService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StripeCheckoutServiceImpl implements StripeCheckoutService {

	@Value("${stripe.url.success}")
	private String successUrl;

	@Value("${stripe.url.cancel}")
	private String cancelUrl;

	@Override
	public StripeCheckoutResponse createCheckoutSession(
			Long orderId,
			BigDecimal amount,
			String currency) {

		try {
			log.info("Creating Stripe Checkout Session for orderId={}", orderId);

			SessionCreateParams params =
					SessionCreateParams.builder()
					.setMode(SessionCreateParams.Mode.PAYMENT)
					.setSuccessUrl(successUrl)
					.setCancelUrl(cancelUrl)
					.addLineItem(
							SessionCreateParams.LineItem.builder()
							.setQuantity(1L)
							.setPriceData(
									SessionCreateParams.LineItem.PriceData.builder()
									.setCurrency(
											currency != null ? currency : "INR"
											)
									.setUnitAmount(
											amount
											.multiply(BigDecimal.valueOf(100))
											.longValue()
											)
									.setProductData(
											SessionCreateParams.LineItem
											.PriceData
											.ProductData
											.builder()
											.setName("Order #" + orderId)
											.build()
											)
									.build()
									)
							.build()
							)
					.putMetadata("orderId", orderId.toString())
					.build();

			Session session = Session.create(params);

			log.info(
					"Stripe Checkout Session created | sessionId={}",
					session.getId());

			return new StripeCheckoutResponse(session.getId(),session.getUrl());

		} catch (StripeException e) {
			log.error(
					"Stripe Checkout Session creation failed | orderId={}",
					orderId,e);
			throw new StripeCheckoutException(
					"Failed to create Stripe checkout session",e);
		}
	}

	@Override
	public boolean verifyPayment(String sessionId) {
		try {
			Session session = Session.retrieve(sessionId);

			return "paid".equalsIgnoreCase(session.getPaymentStatus());

		} catch (StripeException e) {
			log.error(
					"Stripe payment verification failed | sessionId={}",
					sessionId,e);
			throw new StripeCheckoutException(
					"Failed to verify Stripe payment for sessionId: " + sessionId,
					e);
		}
	}
}
