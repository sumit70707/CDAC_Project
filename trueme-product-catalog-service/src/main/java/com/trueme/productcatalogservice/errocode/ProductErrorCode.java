package com.trueme.productcatalogservice.errocode;

import org.springframework.http.HttpStatus;

public enum ProductErrorCode {

	PROD_404(HttpStatus.NOT_FOUND, "Product not found"),
	PROD_409(HttpStatus.CONFLICT, "Product already exists"),
	PROD_400(HttpStatus.BAD_REQUEST, "Invalid product data"),
	PROD_403_INACTIVE(HttpStatus.FORBIDDEN, "Product is inactive"),
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

