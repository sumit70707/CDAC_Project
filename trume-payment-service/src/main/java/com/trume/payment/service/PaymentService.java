package com.trume.payment.service;

import com.trume.payment.dto.PaymentCreateRequestDto;
import com.trume.payment.dto.PaymentResponseDto;
import com.trume.payment.dto.PaymentStatusUpdateRequestDto;
import com.trume.payment.entity.enums.PaymentStatus;

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
