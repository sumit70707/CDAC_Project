package com.trueme.productcatalogservice.exception.wishlist;

import com.trueme.productcatalogservice.errocode.WishlistErrorCode;
import com.trueme.productcatalogservice.exception.WishlistException;

public class WishlistAlreadyExistsException extends WishlistException {

	public WishlistAlreadyExistsException(Long id) {
		super(
				WishlistErrorCode.WISH_409,
				"Product already exists in wishlist with id: " + id
				);
	}
}
