package com.trueme.notification.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trueme.notification.dto.PaymentNotificationEventDto;
import com.trueme.notification.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentNotificationConsumer {

    private final ObjectMapper objectMapper;
    private final EmailService emailService;

    @KafkaListener(
            topics = "payment-notification-events",
            groupId = "trueme-notification-group"
    )
    public void consumePaymentNotification(String message) {

        try {
            // 1️ Deserialize event
            PaymentNotificationEventDto event =
                    objectMapper.readValue(message, PaymentNotificationEventDto.class);

            log.info("Received PaymentNotificationEvent: {}", event);

            // 2️ Send email
            emailService.sendPaymentStatusEmail(event);

            log.info(
                    "Payment email sent | orderNumber={} | status={}",
                    event.getOrderNumber(),
                    event.getStatus()
            );

        } catch (Exception ex) {
            log.error("Failed to process PaymentNotificationEvent", ex);
        }
    }
}
