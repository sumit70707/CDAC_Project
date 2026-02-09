package com.trueme.orderservice.errorcode;

import org.springframework.http.HttpStatus;

public enum CartErrorCode {

    CART_404(HttpStatus.NOT_FOUND, "Cart not found"),
    CART_ITEM_404(HttpStatus.NOT_FOUND, "Cart item not found"),
    CART_400_EMPTY(HttpStatus.BAD_REQUEST, "Cart is empty"),
    CART_400_INVALID_QTY(HttpStatus.BAD_REQUEST, "Invalid quantity"),
    CART_409_CHECKED_OUT(HttpStatus.CONFLICT, "Cart already checked out");

    private final HttpStatus status;
    private final String defaultMessage;

    CartErrorCode(HttpStatus status, String defaultMessage) {
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
