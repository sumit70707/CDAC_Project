package com.trueme.payment.exception.payment;

import com.trueme.payment.errorcode.PaymentErrorCode;
import com.trueme.payment.exception.PaymentException;

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
