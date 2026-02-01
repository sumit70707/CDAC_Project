package com.trueme.notification.dto;

import com.trueme.notification.entity.enums.PaymentStatusWebhook;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentEventDto {

	private String orderNumber;

	private String stripePaymentId;

	private PaymentStatusWebhook status;

}