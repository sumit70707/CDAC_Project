package com.trueme.orderservice.exception;

import com.trueme.orderservice.errorcode.ProductErrorCode;

public abstract class ProductException extends RuntimeException {
	
	private final ProductErrorCode errorCode;

    protected ProductException(ProductErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    protected ProductException(ProductErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ProductErrorCode getErrorCode() {
        return errorCode;
    }

}
