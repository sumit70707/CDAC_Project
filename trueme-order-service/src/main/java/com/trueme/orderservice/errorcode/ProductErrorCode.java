package com.trueme.orderservice.errorcode;

import org.springframework.http.HttpStatus;

public enum ProductErrorCode {

	PROD_404(HttpStatus.NOT_FOUND, "Product not found"),
	PROD_400_INACTIVE(HttpStatus.BAD_REQUEST, "Product is not available"),
	PROD_409_STOCK(HttpStatus.CONFLICT, "Insufficient product stock");

	private final HttpStatus status;
	private final String defaultMessage;

	ProductErrorCode(HttpStatus status, String defaultMessage) {
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
