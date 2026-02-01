package com.trueme.orderservice.dto;

import java.math.BigDecimal;

import com.trueme.orderservice.kafka.dto.PaymentEventStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PaymentNotificationEventDto {

    private String userName;
    private String userEmail;

    private String orderNumber;
    private String stripePaymentId;
    private BigDecimal amount;

    private PaymentEventStatus status;
}
