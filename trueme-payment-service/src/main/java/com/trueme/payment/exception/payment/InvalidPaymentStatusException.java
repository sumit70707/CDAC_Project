package com.trueme.payment.exception.payment;

import com.trueme.payment.errorcode.PaymentErrorCode;
import com.trueme.payment.exception.PaymentException;

public class InvalidPaymentStatusException extends PaymentException {

    public InvalidPaymentStatusException(String status) {
        super(
            PaymentErrorCode.PAY_422,
            "Invalid payment status: " + status);
    }
}
