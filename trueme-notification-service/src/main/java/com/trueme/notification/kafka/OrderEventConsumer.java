package com.trueme.notification.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trueme.notification.dto.OrderEventDto;
import com.trueme.notification.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(
            topics = "order-events",
            groupId = "trueme-notification-group"
    )
    public void consumeOrderEvent(String message) {

        try {
            // 1️ Deserialize Kafka message
            OrderEventDto event =
                    objectMapper.readValue(message, OrderEventDto.class);

            log.info("Received OrderEvent: {}", event);

            // 2️ Route based on event type
            switch (event.getEventType()) {

                case ORDER_CREATED:
                    handleOrderCreated(event);
                    break;

                case ITEM_STATUS_UPDATED:
                    handleItemStatusUpdated(event);
                    break;

                case ORDER_CANCELLED:
                    handleOrderCancelled(event);
                    break;

                default:
                    log.warn("Unhandled OrderEventType: {}", event.getEventType());
            }

        } catch (Exception ex) {
            log.error("Failed to process OrderEvent message", ex);
            // Later: retry / DLQ
        }
    }

    // ORDER CREATED
    private void handleOrderCreated(OrderEventDto event) {

        log.info(
                "Sending ORDER_CREATED email for orderNumber={}",
                event.getOrderNumber()
        );

        emailService.sendOrderCreatedEmail(
                event.getUserEmail(),
                event.getUserName(),
                event.getOrderNumber(),
                event.getItems(),
                event.getTotalAmount(),
                event.getPaymentStatus()
        );
    }

    // ITEM STATUS UPDATED
    private void handleItemStatusUpdated(OrderEventDto event) {

        log.info(
                "Sending ITEM_STATUS_UPDATED email for orderNumber={}",
                event.getOrderNumber()
        );

        emailService.sendItemStatusUpdatedEmail(
                event.getUserEmail(),
                event.getUserName(),
                event.getOrderNumber(),
                event.getItems(),              // ONLY updated items
                event.getPaymentStatus()
        );
    }

    // ORDER CANCELLED 
    private void handleOrderCancelled(OrderEventDto event) {

        log.info(
                "Sending ORDER_CANCELLED email for orderNumber={}",
                event.getOrderNumber()
        );

        emailService.sendOrderCancelledEmail(
                event.getUserEmail(),
                event.getUserName(),
                event.getOrderNumber(),
                event.getItems(),
                event.getTotalAmount()
        );
    }
}
