package com.trueme.payment.service;

import com.trueme.payment.dto.PaymentCreateRequestDto;
import com.trueme.payment.dto.PaymentResponseDto;
import com.trueme.payment.dto.PaymentStatusUpdateRequestDto;
import com.trueme.payment.entity.enums.PaymentStatus;

public interface PaymentService {

	/**
	 * Creates a new payment entry for an order (idempotent).
	 */
	PaymentResponseDto createPayment(PaymentCreateRequestDto request);

	/**
	 * Updates payment status after Stripe response.
	 */
	PaymentResponseDto updatePaymentStatus(PaymentStatusUpdateRequestDto request);
	
	PaymentStatus cancelPayment(String stripePaymentId);

}
