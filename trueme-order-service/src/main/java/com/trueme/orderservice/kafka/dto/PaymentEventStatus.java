package com.trueme.orderservice.kafka.dto;

public enum PaymentEventStatus {
    INITIATED,
    PROCESSING,
    SUCCEEDED,
    FAILED,
    CANCELED
}
