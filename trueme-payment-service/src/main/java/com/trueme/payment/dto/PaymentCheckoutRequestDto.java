package com.trueme.payment.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCheckoutRequestDto {
	private Long orderId;
	private String orderNumber;
	private Long userId;
	private BigDecimal amount;
	private String currency;

}
