package com.trueme.orderservice.dto;

import com.trueme.orderservice.entity.enums.PaymentStatusFromPaymentService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderPaymentStatusUpdateRequestDto {

	private Long orderId;
	private Long paymentId;
	private PaymentStatusFromPaymentService paymentStatusFromPaymentService;
}
