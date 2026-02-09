package com.trueme.payment.exception.payment;

import com.trueme.payment.errorcode.PaymentErrorCode;
import com.trueme.payment.exception.PaymentException;

public class PaymentAlreadyProcessedException extends PaymentException {

    public PaymentAlreadyProcessedException(Long paymentId) {
        super(
            PaymentErrorCode.PAY_409,
            "Payment already processed with id: " + paymentId
        );
    }
}

