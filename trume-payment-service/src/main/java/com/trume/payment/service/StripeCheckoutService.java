package com.trume.payment.service;

import java.math.BigDecimal;

import com.trume.payment.dto.StripeCheckoutResponse;

public interface StripeCheckoutService {
	
	 StripeCheckoutResponse createCheckoutSession(
	            Long orderId,
	            BigDecimal amount,
	            String currency
	    );
	 
	 boolean verifyPayment(String sessionId);


}
