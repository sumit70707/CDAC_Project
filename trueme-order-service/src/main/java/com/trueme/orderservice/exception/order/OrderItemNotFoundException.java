package com.trueme.orderservice.exception.order;

import com.trueme.orderservice.errorcode.OrderErrorCode;
import com.trueme.orderservice.exception.OrderException;

public class OrderItemNotFoundException extends OrderException {

    public OrderItemNotFoundException(Long orderItemId) {
        super(
            OrderErrorCode.ITEM_404,
            "Order item not found with id: " + orderItemId
        );
    }
}

