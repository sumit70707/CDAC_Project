package com.trume.payment.exception.payment;

import com.trume.payment.entity.enums.PaymentStatus;
import com.trume.payment.errorcode.PaymentErrorCode;
import com.trume.payment.exception.PaymentException;

public class InvalidPaymentStatusTransitionException extends PaymentException {

    public InvalidPaymentStatusTransitionException(
            PaymentStatus currentStatus,
            PaymentStatus newStatus) {

        super(
            PaymentErrorCode.PAY_422,
            String.format(
                "Invalid payment status transition from %s to %s",
                currentStatus,
                newStatus
            )
        );
    }
}

