package com.trueme.payment.service;

import java.math.BigDecimal;

import com.trueme.payment.dto.StripeCheckoutResponseDto;

public interface StripeCheckoutService {
	
	StripeCheckoutResponseDto createCheckoutSession(
	            String orderNumber,
	            BigDecimal amount,
	            String currency
	    );
	 
	 boolean verifyPayment(String sessionId);


}
