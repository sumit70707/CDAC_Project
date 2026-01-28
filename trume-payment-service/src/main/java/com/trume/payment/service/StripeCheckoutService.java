package com.trume.payment.service;

import java.math.BigDecimal;

import com.trume.payment.dto.StripeCheckoutResponseDto;

public interface StripeCheckoutService {
	
	StripeCheckoutResponseDto createCheckoutSession(
	            Long orderId,
	            BigDecimal amount,
	            String currency
	    );
	 
	 boolean verifyPayment(String sessionId);


}
