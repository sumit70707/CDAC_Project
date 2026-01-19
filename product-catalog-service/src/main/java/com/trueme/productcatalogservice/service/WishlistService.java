package com.trueme.productcatalogservice.service;

import java.util.List;

import com.trueme.productcatalogservice.dto.WishlistResponseDto;

public interface WishlistService {

	public List<WishlistResponseDto> getWishlistByUser(Long userId);
	
}
