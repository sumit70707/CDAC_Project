package com.trume.payment.exception.payment;

import com.trume.payment.errorcode.PaymentErrorCode;
import com.trume.payment.exception.PaymentException;

public class DuplicatePaymentException extends PaymentException {

    public DuplicatePaymentException(Long orderId) {
        super(
            PaymentErrorCode.PAY_409,
            "Payment already exists for orderId: " + orderId);
    }
}
