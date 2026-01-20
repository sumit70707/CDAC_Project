package com.trueme.productcatalogservice.exception;

import com.trueme.productcatalogservice.errocode.WishlistErrorCode;

public abstract class WishlistException extends RuntimeException {

	private final WishlistErrorCode errorCode;

	protected WishlistException(WishlistErrorCode errorCode, String message) {
		super(message);
		this.errorCode = errorCode;
	}

	public WishlistErrorCode getErrorCode() {
		return errorCode;
	}
}
