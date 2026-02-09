package com.trueme.orderservice.exception.product;

import com.trueme.orderservice.errorcode.ProductErrorCode;
import com.trueme.orderservice.exception.ProductException;

public class InsufficientStockException extends ProductException {

    public InsufficientStockException(Long productId) {
        super(
            ProductErrorCode.PROD_409_STOCK,
            "Insufficient stock for product id: " + productId
        );
    }
}

