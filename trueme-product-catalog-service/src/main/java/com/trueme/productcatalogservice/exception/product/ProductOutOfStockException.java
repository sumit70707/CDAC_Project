package com.trueme.productcatalogservice.exception.product;

import com.trueme.productcatalogservice.errocode.ProductErrorCode;
import com.trueme.productcatalogservice.exception.ProductException;

public class ProductOutOfStockException extends ProductException {

	public ProductOutOfStockException(Long productId) {
		super(
				ProductErrorCode.PROD_409_STOCK,
				"Product is out of stock for id: " + productId
				);
	}
}

