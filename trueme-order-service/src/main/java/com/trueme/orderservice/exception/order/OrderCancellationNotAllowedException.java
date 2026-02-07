package com.trueme.orderservice.exception.order;

import com.trueme.orderservice.errorcode.OrderErrorCode;
import com.trueme.orderservice.exception.OrderException;

public class OrderCancellationNotAllowedException extends OrderException {

    public OrderCancellationNotAllowedException(Long orderId) {
        super(
            OrderErrorCode.ORD_405_NOT_ALLOWED,
            "Order cannot be cancelled once shipment has started  :" + orderId
        );
    }
}