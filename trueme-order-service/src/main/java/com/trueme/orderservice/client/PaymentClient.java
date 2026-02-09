package com.trueme.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.trueme.orderservice.dto.PaymentCheckoutRequest;
import com.trueme.orderservice.dto.PaymentCheckoutResponseDto;

@FeignClient(
	    name = "trume-payment-service",
	    url = "${trume.payment.service.url}"
	)
	public interface PaymentClient {

	    @PostMapping("/internal/payments/checkout")
	    PaymentCheckoutResponseDto createCheckout(
	            @RequestBody PaymentCheckoutRequest request);
	}
