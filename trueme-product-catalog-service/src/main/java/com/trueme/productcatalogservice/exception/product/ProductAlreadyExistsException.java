package com.trueme.productcatalogservice.exception.product;

import com.trueme.productcatalogservice.errocode.ProductErrorCode;
import com.trueme.productcatalogservice.exception.ProductException;

public class ProductAlreadyExistsException extends ProductException {

	public ProductAlreadyExistsException(String productName) {
		super(
				ProductErrorCode.PROD_409,
				"Product already exists with name: " + productName
				);
	}
}
