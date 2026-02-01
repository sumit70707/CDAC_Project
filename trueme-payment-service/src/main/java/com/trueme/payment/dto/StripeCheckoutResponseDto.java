package com.trueme.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StripeCheckoutResponseDto {

    private String sessionId;
    private String checkoutUrl;

}
