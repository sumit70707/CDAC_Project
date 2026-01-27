package com.trume.payment.exception.payment;

import com.trume.payment.errorcode.PaymentErrorCode;
import com.trume.payment.exception.PaymentException;

public class InvalidPaymentStatusException extends PaymentException {

    public InvalidPaymentStatusException(String status) {
        super(
            PaymentErrorCode.PAY_422,
            "Invalid payment status: " + status);
    }
}
