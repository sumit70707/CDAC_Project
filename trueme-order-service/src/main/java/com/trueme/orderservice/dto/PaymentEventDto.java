package com.trueme.orderservice.dto;

import java.math.BigDecimal;

import com.trueme.orderservice.kafka.dto.PaymentEventStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEventDto {

    private Long orderId;
    private String orderNumber;
    private String stripePaymentId;
    private BigDecimal amount;
    private PaymentEventStatus status;
}
