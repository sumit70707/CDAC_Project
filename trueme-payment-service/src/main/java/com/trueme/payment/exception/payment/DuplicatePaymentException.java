package com.trueme.payment.exception.payment;

import com.trueme.payment.errorcode.PaymentErrorCode;
import com.trueme.payment.exception.PaymentException;

public class DuplicatePaymentException extends PaymentException {

    public DuplicatePaymentException(Long orderId) {
        super(
            PaymentErrorCode.PAY_409,
            "Payment already exists for orderId: " + orderId);
    }
}
