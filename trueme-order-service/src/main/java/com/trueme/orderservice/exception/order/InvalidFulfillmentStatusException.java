package com.trueme.orderservice.exception.order;

import com.trueme.orderservice.errorcode.OrderErrorCode;
import com.trueme.orderservice.exception.OrderException;

public class InvalidFulfillmentStatusException extends OrderException {

    public InvalidFulfillmentStatusException(String status) {
        super(
            OrderErrorCode.ITEM_400_INVALID_STATUS,
            "Invalid fulfillment status: " + status
        );
    }
}

