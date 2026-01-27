package com.trume.payment.dto;

import com.trume.payment.entity.enums.PaymentStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaymentStatusUpdateRequestDto {

    @NotNull
    private String stripePaymentId;

    @NotNull
    private PaymentStatus status;
}

