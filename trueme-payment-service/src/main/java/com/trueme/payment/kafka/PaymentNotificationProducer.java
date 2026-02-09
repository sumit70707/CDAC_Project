package com.trueme.payment.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trueme.payment.dto.PaymentEventDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentNotificationProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TOPIC = "payment-events";

    public void publishOrderEvent(PaymentEventDto event) {

        try {
            String message = objectMapper.writeValueAsString(event);

            kafkaTemplate.send(TOPIC, message);

            log.info("OrderEvent published to Kafka: {}", event);

        } catch (Exception ex) {
            // IMPORTANT: never fail order flow
            log.error("Failed to publish OrderEvent to Kafka", ex);
        }
    }
}
