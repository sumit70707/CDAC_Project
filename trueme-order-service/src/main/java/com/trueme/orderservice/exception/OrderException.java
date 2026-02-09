package com.trueme.orderservice.exception;

import com.trueme.orderservice.errorcode.OrderErrorCode;

public abstract class OrderException extends RuntimeException {

    private final OrderErrorCode errorCode;

    protected OrderException(OrderErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    protected OrderException(OrderErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }


	public OrderErrorCode getErrorCode() {
        return errorCode;
    }
}
