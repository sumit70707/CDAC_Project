package com.trume.payment.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.trume.payment.dto.PaymentStatusUpdateRequestDto;
import com.trume.payment.entity.enums.PaymentStatus;
import com.trume.payment.exception.payment.StripeCheckoutException;
import com.trume.payment.service.PaymentService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;



import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/webhooks/stripe")
@Slf4j
public class StripeWebhookController {

	// Used to verify that the request is sent by Stripe
	@Value("${stripe.webhook.secret}")
	private String webhookSecret;

	private final PaymentService paymentService;

	public StripeWebhookController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}

	@PostMapping
	public ResponseEntity<String> handleStripeWebhook(
			@RequestBody String payload,
			@RequestHeader("Stripe-Signature") String sigHeader) {

		Event event;

		try {
			// 1️ Verify webhook signature
			event = Webhook.constructEvent(
					payload,
					sigHeader,
					webhookSecret
					);
		} catch (SignatureVerificationException e) {
			log.error("Invalid Stripe webhook signature", e);
			return ResponseEntity.badRequest().body("Invalid signature");
		}

		log.info("Stripe webhook received | type={}", event.getType());

		// Handle events
		switch (event.getType()) {

		//  Payment completed successfully
		case "checkout.session.completed":
			handleCheckoutSessionCompleted(event);
			break;

			//  Card failed / authentication failed
		case "payment_intent.payment_failed":
			handlePaymentFailed(event);
			break;

			//  User abandoned checkout / session expired
		case "checkout.session.expired":
			handleCheckoutSessionExpired(event);
			break;

		default:
			log.warn("Unhandled Stripe event type={}", event.getType());
		}

		return ResponseEntity.ok("Webhook processed");
	}

	private void handleCheckoutSessionCompleted(Event event) {

		// 1️ Get raw JSON string
		String rawJson = event.getDataObjectDeserializer().getRawJson();

		if (rawJson == null || rawJson.isBlank()) {
			throw new StripeCheckoutException(
					"Stripe webhook payload is empty"
					);
		}

		// 2️Parse JSON safely
		JsonObject eventData =
				JsonParser.parseString(rawJson).getAsJsonObject();

		// 3️ Extract session ID
		if (!eventData.has("id")) {
			throw new StripeCheckoutException(
					"Stripe webhook payload missing session id");
		}

		String sessionId = eventData.get("id").getAsString();

		log.info(
				"Stripe checkout.session.completed | sessionId={}",sessionId);

		// 4️ Update payment status
		// PaymentService will:
        // - update Payment table
        // - notify Order Service
		paymentService.updatePaymentStatus(
				new PaymentStatusUpdateRequestDto(
						sessionId, PaymentStatus.SUCCEEDED));
	}

	private void handlePaymentFailed(Event event) {

		String rawJson = event.getDataObjectDeserializer().getRawJson();

		if (rawJson == null) {
			throw new StripeCheckoutException("Empty webhook payload");
		}

		JsonObject data =
				JsonParser.parseString(rawJson).getAsJsonObject();


        // 1️ PaymentIntent does NOT contain sessionId directly
        // So we fetch it from metadata (added during checkout creation)
		JsonObject metadata = data.getAsJsonObject("metadata");

		if (metadata == null || !metadata.has("checkout_session_id")) {
			log.warn("PaymentIntent missing checkout_session_id");
			return;
		}

		String sessionId =
				metadata.get("checkout_session_id").getAsString();

		log.info(
				"Stripe payment_intent.payment_failed | sessionId={}",
				sessionId);

		paymentService.updatePaymentStatus(
				new PaymentStatusUpdateRequestDto(
						sessionId,
						PaymentStatus.FAILED));
	}


	private void handleCheckoutSessionExpired(Event event) {

		String rawJson = event.getDataObjectDeserializer().getRawJson();

		JsonObject data =
				JsonParser.parseString(rawJson).getAsJsonObject();

		String sessionId = data.get("id").getAsString();

		log.info(
				"Stripe checkout.session.expired | sessionId={}", sessionId);

		paymentService.updatePaymentStatus(
				new PaymentStatusUpdateRequestDto(
						sessionId,
						PaymentStatus.CANCELED));
	}


}
