package com.trueme.orderservice.exception.cart;

import com.trueme.orderservice.errorcode.CartErrorCode;
import com.trueme.orderservice.exception.CartException;

public class CartItemNotFoundException extends CartException {

    public CartItemNotFoundException(Long productId) {
        super(
            CartErrorCode.CART_ITEM_404,
            "Cart item not found for productId: " + productId
        );
    }
}
