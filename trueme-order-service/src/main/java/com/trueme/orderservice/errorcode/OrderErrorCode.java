package com.trueme.orderservice.errorcode;

import org.springframework.http.HttpStatus;

public enum OrderErrorCode {

    ORD_404(HttpStatus.NOT_FOUND, "Order not found"),
    ORD_400_EMPTY_CART(HttpStatus.BAD_REQUEST, "Cannot place order with empty cart"),
    ORD_409_ALREADY_PLACED(HttpStatus.CONFLICT, "Order already placed"),
    ORD_400_INVALID_STATUS(HttpStatus.BAD_REQUEST, "Invalid order status transition"),
    ITEM_404(HttpStatus.NOT_FOUND, "Order item not found"),
    ITEM_400_INVALID_STATUS(HttpStatus.BAD_REQUEST, "Invalid fulfillment status"),
    ITEM_409_ALREADY_DELIVERED(HttpStatus.CONFLICT, "Order item already delivered");

    private final HttpStatus status;
    private final String defaultMessage;

    OrderErrorCode(HttpStatus status, String defaultMessage) {
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

