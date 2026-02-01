package com.trueme.payment.dto;

import java.math.BigDecimal;

import com.trueme.payment.entity.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentEventDto {

	private Long orderId;

	private String orderNumber;

	private String stripePaymentId;
	
	private BigDecimal amount;

	private PaymentStatus status;

}
