package com.trueme.productcatalogservice.exception.product;

import com.trueme.productcatalogservice.errocode.ProductErrorCode;
import com.trueme.productcatalogservice.exception.ProductException;

public class ProductNotFoundException extends ProductException {

	public ProductNotFoundException(Long productId) {
		super(
				ProductErrorCode.PROD_404,
				"Product not found with id: " + productId
				);
	}

	public ProductNotFoundException(String name) {
		super(
				ProductErrorCode.PROD_404,
				"Product not found with name: " + name
				);
	}
}
