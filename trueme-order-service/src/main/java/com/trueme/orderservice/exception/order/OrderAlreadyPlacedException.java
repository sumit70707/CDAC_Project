package com.trueme.orderservice.exception.order;

import com.trueme.orderservice.errorcode.OrderErrorCode;
import com.trueme.orderservice.exception.OrderException;

public class OrderAlreadyPlacedException extends OrderException {

    public OrderAlreadyPlacedException(String orderNumber) {
        super(
            OrderErrorCode.ORD_409_ALREADY_PLACED,
            "Order already placed with orderNumber: " + orderNumber
        );
    }
}

