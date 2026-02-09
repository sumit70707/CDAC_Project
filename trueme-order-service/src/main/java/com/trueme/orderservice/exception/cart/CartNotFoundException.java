package com.trueme.orderservice.exception.cart;

import com.trueme.orderservice.errorcode.CartErrorCode;
import com.trueme.orderservice.exception.CartException;

public class CartNotFoundException extends CartException {

    public CartNotFoundException(Long userId) {
        super(
            CartErrorCode.CART_404,
            "Cart not found for userId: " + userId
        );
    }
}
