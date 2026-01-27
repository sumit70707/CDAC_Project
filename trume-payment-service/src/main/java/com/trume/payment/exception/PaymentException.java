package com.trume.payment.exception;


import com.trume.payment.errorcode.PaymentErrorCode;

public abstract class PaymentException extends RuntimeException {

    private final PaymentErrorCode errorCode;

    protected PaymentException(PaymentErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    protected PaymentException(PaymentErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public PaymentErrorCode getErrorCode() {
        return errorCode;
    }
}

