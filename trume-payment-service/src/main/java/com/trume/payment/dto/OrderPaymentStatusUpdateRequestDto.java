package com.trume.payment.dto;

import com.trume.payment.entity.enums.PaymentStatusFromPaymentService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentStatusUpdateRequestDto {

    private Long orderId;
    private Long paymentId;
    private PaymentStatusFromPaymentService paymentStatusFromPaymentService;
}
