package com.trueme.productcatalogservice.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.productcatalogservice.dto.ProductResponseDto;
import com.trueme.productcatalogservice.dto.WishlistResponseDto;
import com.trueme.productcatalogservice.repository.WishlistRepository;
import com.trueme.productcatalogservice.service.WishlistService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

	private final WishlistRepository repo;
	
	private final ModelMapper modelMapper;

	
	@Override
	public List<WishlistResponseDto> getWishlistByUser(Long userId) {
		
		return repo.findByUserId(userId)
	            .stream()
	            .map(wishlist -> {
	                WishlistResponseDto dto =
	                        modelMapper.map(wishlist, WishlistResponseDto.class);
	                ProductResponseDto productDto =
	                        modelMapper.map(
	                                wishlist.getProduct(),
	                                ProductResponseDto.class
	                        );
	                dto.setProduct(productDto);
	                return dto;
	            })
	            .collect(Collectors.toList());
		
	}

}
