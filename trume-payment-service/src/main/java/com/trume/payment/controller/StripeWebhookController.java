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

            case "checkout.session.completed":
                handleCheckoutSessionCompleted(event);
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
        paymentService.updatePaymentStatus(
                new PaymentStatusUpdateRequestDto(
                        sessionId, PaymentStatus.SUCCEEDED));
    }
}
