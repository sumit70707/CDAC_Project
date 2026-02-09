package com.trueme.orderservice.exception.cart;

import com.trueme.orderservice.errorcode.CartErrorCode;
import com.trueme.orderservice.exception.CartException;

public class EmptyCartException extends CartException {

    public EmptyCartException() {
        super(CartErrorCode.CART_400_EMPTY);
    }
}

