package com.trueme.orderservice.exception.order;

import com.trueme.orderservice.errorcode.OrderErrorCode;
import com.trueme.orderservice.exception.OrderException;

public class InvalidOrderStatusException extends OrderException {

    public InvalidOrderStatusException(String currentStatus, String attemptedStatus) {
        super(
            OrderErrorCode.ORD_400_INVALID_STATUS,
            "Invalid order status transition from " + currentStatus +
            " to " + attemptedStatus
        );
    }
}
