package com.trueme.orderservice.exception.product;

import com.trueme.orderservice.errorcode.ProductErrorCode;
import com.trueme.orderservice.exception.ProductException;

public class ProductNotFoundException extends ProductException {

    public ProductNotFoundException(Long productId) {
        super(
            ProductErrorCode.PROD_404,
            "Product not found with id: " + productId
        );
    }
}

