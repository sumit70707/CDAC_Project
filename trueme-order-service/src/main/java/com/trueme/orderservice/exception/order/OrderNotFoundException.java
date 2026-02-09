package com.trueme.orderservice.exception.order;

import com.trueme.orderservice.errorcode.OrderErrorCode;
import com.trueme.orderservice.exception.OrderException;

public class OrderNotFoundException extends OrderException {

    public OrderNotFoundException(Long orderId) {
        super(
            OrderErrorCode.ORD_404,
            "Order not found with id: " + orderId);
    }
}

