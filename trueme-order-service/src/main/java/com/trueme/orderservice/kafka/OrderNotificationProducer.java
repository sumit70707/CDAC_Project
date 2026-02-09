package com.trueme.orderservice.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trueme.orderservice.dto.OrderEventDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderNotificationProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TOPIC = "order-events";

    public void publishOrderEvent(OrderEventDto event) {

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
