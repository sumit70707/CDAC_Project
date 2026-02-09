package com.trueme.orderservice.exception;

import com.trueme.orderservice.errorcode.CartErrorCode;

public abstract class CartException extends RuntimeException {

    private final CartErrorCode errorCode;

    protected CartException(CartErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    protected CartException(CartErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public CartErrorCode getErrorCode() {
        return errorCode;
    }
}
