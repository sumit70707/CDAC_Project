package com.trueme.productcatalogservice.service;

import java.util.List;

import com.trueme.productcatalogservice.dto.WishlistResponseDto;

public interface WishlistService {

	List<WishlistResponseDto> getWishlistByUser(Long userId);

	WishlistResponseDto addToWishlist(Long userId, Long productId);

	//WishlistResponseDto getWishlistById(Long userId,Long wishlistId);

	void removeFromWishlist(Long userId, Long productId);

}
