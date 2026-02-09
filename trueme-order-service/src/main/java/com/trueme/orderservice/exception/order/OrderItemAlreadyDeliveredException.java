package com.trueme.orderservice.exception.order;

import com.trueme.orderservice.errorcode.OrderErrorCode;
import com.trueme.orderservice.exception.OrderException;

public class OrderItemAlreadyDeliveredException extends OrderException {

    public OrderItemAlreadyDeliveredException(Long orderItemId) {
        super(
            OrderErrorCode.ITEM_409_ALREADY_DELIVERED,
            "Order item already delivered. orderItemId: " + orderItemId
        );
    }
}

