package com.trueme.orderservice.exception.cart;

import com.trueme.orderservice.errorcode.CartErrorCode;
import com.trueme.orderservice.exception.CartException;

public class CartAlreadyCheckedOutException extends CartException {

    public CartAlreadyCheckedOutException(Long cartId) {
        super(
            CartErrorCode.CART_409_CHECKED_OUT,
            "Cart with id " + cartId + " is already checked out"
        );
    }
}
