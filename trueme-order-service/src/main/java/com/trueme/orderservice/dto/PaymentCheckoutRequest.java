package com.trueme.orderservice.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCheckoutRequest {
    private Long orderId;
    private String orderNumber;
    private Long userId;
    private String userName;
    private String email;
    private BigDecimal amount;
    private String currency;
}