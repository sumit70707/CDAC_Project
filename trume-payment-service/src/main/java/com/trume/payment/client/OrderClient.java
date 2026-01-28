package com.trume.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.trume.payment.dto.OrderPaymentStatusUpdateRequestDto;

@FeignClient(
	    name = "trueme-order-service",
	    url = "${trueme.order.service.url}"
	)
	public interface OrderClient {
///internal/orders/payment-status
	    @PutMapping("/internal/orders/payment-status")
	    void updateOrderPaymentStatus(
	            @RequestBody OrderPaymentStatusUpdateRequestDto request);
	}
