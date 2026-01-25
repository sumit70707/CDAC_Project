package com.trueme.orderservice.exception.cart;

import com.trueme.orderservice.errorcode.CartErrorCode;
import com.trueme.orderservice.exception.CartException;

public class InvalidCartQuantityException extends CartException {

    public InvalidCartQuantityException(Integer quantity) {
        super(
            CartErrorCode.CART_400_INVALID_QTY,
            "Invalid quantity: " + quantity + ". Quantity must be greater than zero."
        );
    }
}

