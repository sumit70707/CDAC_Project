package com.trueme.productcatalogservice.exception;

import com.trueme.productcatalogservice.errocode.ProductErrorCode;

public abstract class ProductException extends RuntimeException {

	private final ProductErrorCode errorCode;

	protected ProductException(ProductErrorCode errorCode, String message) {
		super(message);
		this.errorCode = errorCode;
	}

	public ProductErrorCode getErrorCode() {
		return errorCode;
	}
}

