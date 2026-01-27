package com.trume.payment.exception.payment;

import com.trume.payment.errorcode.PaymentErrorCode;
import com.trume.payment.exception.PaymentException;

public class StripeCheckoutException extends PaymentException {

    public StripeCheckoutException(String message) {
        super(
            PaymentErrorCode.PAY_500,
            message
        );
    }

    public StripeCheckoutException(String message, Throwable cause) {
        super(
            PaymentErrorCode.PAY_500,
            message
        );
        initCause(cause);
    }
}
