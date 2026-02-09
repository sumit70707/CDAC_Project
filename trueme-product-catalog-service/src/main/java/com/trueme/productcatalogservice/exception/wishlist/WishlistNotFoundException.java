package com.trueme.productcatalogservice.exception.wishlist;

import com.trueme.productcatalogservice.errocode.WishlistErrorCode;
import com.trueme.productcatalogservice.exception.WishlistException;

public class WishlistNotFoundException extends WishlistException {

	public WishlistNotFoundException(Long productId) {
		super(
				WishlistErrorCode.WISH_404,
				"Product not found in wishlist with id: " + productId
				);
	}

}
