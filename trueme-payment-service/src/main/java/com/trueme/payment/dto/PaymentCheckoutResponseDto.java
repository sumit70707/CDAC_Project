package com.trueme.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCheckoutResponseDto {

    // Stripe hosted checkout URL
    private String checkoutUrl;
}

