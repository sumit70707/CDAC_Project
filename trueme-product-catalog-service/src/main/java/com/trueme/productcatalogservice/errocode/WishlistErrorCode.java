package com.trueme.productcatalogservice.errocode;

import org.springframework.http.HttpStatus;

public enum WishlistErrorCode {

	WISH_404(HttpStatus.NOT_FOUND, "Wishlist item not found"),
	WISH_409(HttpStatus.CONFLICT, "Product already in wishlist"),
	WISH_404_EMPTY(HttpStatus.NOT_FOUND, "Wishlist is empty");

	private final HttpStatus status;
	private final String defaultMessage;

	WishlistErrorCode(HttpStatus status, String defaultMessage) {
		this.status = status;
		this.defaultMessage = defaultMessage;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public String getCode() {
		return name();
	}

	public String getDefaultMessage() {
		return defaultMessage;
	}
}
