package com.trueme.orderservice.exception.order;

import com.trueme.orderservice.errorcode.OrderErrorCode;
import com.trueme.orderservice.exception.OrderException;

public class EmptyCartForOrderException extends OrderException {

    public EmptyCartForOrderException(Long userId) {
        super(
            OrderErrorCode.ORD_400_EMPTY_CART,
            "Cannot place order. Cart is empty for userId: " + userId
        );
    }
}

