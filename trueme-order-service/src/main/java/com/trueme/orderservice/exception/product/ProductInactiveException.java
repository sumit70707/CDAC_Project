package com.trueme.orderservice.exception.product;

import com.trueme.orderservice.errorcode.ProductErrorCode;
import com.trueme.orderservice.exception.ProductException;

public class ProductInactiveException extends ProductException {

    public ProductInactiveException(Long productId) {
        super(
            ProductErrorCode.PROD_400_INACTIVE,
            "Product with id " + productId + " is not available"
        );
    }
}

