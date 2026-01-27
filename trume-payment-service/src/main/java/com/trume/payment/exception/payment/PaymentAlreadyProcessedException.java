package com.trume.payment.exception.payment;

import com.trume.payment.errorcode.PaymentErrorCode;
import com.trume.payment.exception.PaymentException;

public class PaymentAlreadyProcessedException extends PaymentException {

    public PaymentAlreadyProcessedException(Long paymentId) {
        super(
            PaymentErrorCode.PAY_409,
            "Payment already processed with id: " + paymentId
        );
    }
}

