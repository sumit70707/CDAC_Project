package com.trueme.orderservice.exception.order;

import com.trueme.orderservice.errorcode.OrderErrorCode;
import com.trueme.orderservice.exception.OrderException;

public class AddressNotFoundException extends OrderException {

    public AddressNotFoundException(Long userId) {
        super(
            OrderErrorCode.Add_404_ADDRESS_NOT_FOUND,
            "Address Not Found for UserId" + userId
        );
    }
}