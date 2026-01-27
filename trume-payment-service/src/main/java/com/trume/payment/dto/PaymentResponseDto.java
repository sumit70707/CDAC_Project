package com.trume.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.trume.payment.entity.enums.PaymentMethod;
import com.trume.payment.entity.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDto {

	private Long id;                 //  MUST match entity field
    private Long orderId;

    private String stripePaymentId;
    private String checkoutUrl;      //  REQUIRED for Stripe redirect

    private BigDecimal amount;
    private String currency;

    private PaymentStatus status;
    private PaymentMethod method;

    private LocalDateTime createdAt;
}