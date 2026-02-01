package com.trueme.orderservice.kafka;


import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trueme.orderservice.client.AuthClient;
import com.trueme.orderservice.dto.PaymentEventDto;
import com.trueme.orderservice.dto.PaymentNotificationEventDto;
import com.trueme.orderservice.dto.UserDetailsDto;
import com.trueme.orderservice.entity.Order;
import com.trueme.orderservice.exception.order.OrderNotFoundException;
import com.trueme.orderservice.kafka.dto.PaymentEventStatus;
import com.trueme.orderservice.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final ObjectMapper objectMapper;
    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final AuthClient authClient;

    private static final String TOPIC = "payment-notification-events";

    @KafkaListener(
            topics = "payment-events",
            groupId = "trueme-order-service-group"
    )
    public void consumePaymentEvent(String message) {

        try {
            // 1️ Deserialize event from Payment Service
            PaymentEventDto event =
                    objectMapper.readValue(message, PaymentEventDto.class);

            log.info("Received PaymentEvent: {}", event);

            // 2️ Ignore non-final statuses
            if (event.getStatus() == PaymentEventStatus.INITIATED ||
                event.getStatus() == PaymentEventStatus.PROCESSING) {
                return;
            }

            // 3️ Fetch order ONLY for user + amount
            Order order = orderRepository.findById(event.getOrderId())
                    .orElseThrow(() ->
                            new OrderNotFoundException(event.getOrderId()));
            
            UserDetailsDto userDetails=authClient.getUserDetails(order.getUserId());

            // 4️ Build PAYMENT EMAIL EVENT (THIS IS THE POINT)
            PaymentNotificationEventDto notificationEvent =
                    new PaymentNotificationEventDto(
                    		userDetails.getUserName(),
                    		userDetails.getEmail(),
                            event.getOrderNumber(),
                            event.getStripePaymentId(),
                            order.getTotalAmount(),
                            event.getStatus()
                    );

            // 5️ Send to Notification Service
            kafkaTemplate.send(
                    TOPIC,
                    objectMapper.writeValueAsString(notificationEvent)
            );

            log.info(
                    "PaymentNotificationEvent sent | orderNumber={} status={}",
                    event.getOrderNumber(),
                    event.getStatus()
            );

        } catch (Exception ex) {
            log.error("Failed to process PaymentEvent", ex);
        }
    }
}
