package com.trueme.payment.exception.payment;

import com.trueme.payment.entity.enums.PaymentStatus;
import com.trueme.payment.errorcode.PaymentErrorCode;
import com.trueme.payment.exception.PaymentException;

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

