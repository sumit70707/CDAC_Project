package com.trueme.notification.dto;

import java.math.BigDecimal;

import com.trueme.notification.entity.enums.PaymentEventStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentNotificationEventDto {

    private String userName;
    private String userEmail;

    private String orderNumber;
    private String stripePaymentId;
    private BigDecimal amount;

    private PaymentEventStatus status;
}
