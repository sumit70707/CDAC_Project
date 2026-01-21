package com.trueme.productcatalogservice.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.productcatalogservice.dto.ProductResponseDto;
import com.trueme.productcatalogservice.dto.WishlistResponseDto;
import com.trueme.productcatalogservice.entity.Product;
import com.trueme.productcatalogservice.entity.Wishlist;
import com.trueme.productcatalogservice.exception.product.ProductNotFoundException;
import com.trueme.productcatalogservice.exception.wishlist.WishlistAlreadyExistsException;
import com.trueme.productcatalogservice.exception.wishlist.WishlistNotFoundException;
import com.trueme.productcatalogservice.repository.ProductRepository;
import com.trueme.productcatalogservice.repository.WishlistRepository;
import com.trueme.productcatalogservice.service.WishlistService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WishlistServiceImpl implements WishlistService {

	private final WishlistRepository repo;
	
	private final ProductRepository productRepo;

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


	@Override
	public WishlistResponseDto addToWishlist(Long userId, Long productId) {
		
		log.info("Adding product {} to wishlist for user {}", productId, userId);
		
		if(repo.existsByUserIdAndProduct_Id(userId, productId)) {
			
			log.warn("Product {} already exists in wishlist for user {}", productId, userId);
			
			throw new WishlistAlreadyExistsException(productId);
		}
		
		Product product = productRepo.findById(productId)
	            .orElseThrow(() ->
	                    new ProductNotFoundException(productId));
		
		//TODO Logic for UserExistById
		
		Wishlist wishlist = Wishlist.builder()
	            .product(product)
	            .userId(userId)
	            .build();
		
		Wishlist saved=repo.save(wishlist);
		
		WishlistResponseDto wishlistResponse=modelMapper.map(saved, WishlistResponseDto.class);
		
		ProductResponseDto productResponse=modelMapper.map(product, ProductResponseDto.class);
		
		wishlistResponse.setProduct(productResponse);
		
		log.info("Product added in wishlist with id: {}",wishlistResponse.getId());
		
		return wishlistResponse;
	}

	//TODO think later About this method

//	@Override
//	public WishlistResponseDto getWishlistById(Long userId, Long wishlistId) {
//		
//		Wishlist wishlist= repo.findByIdAndUserId(wishlistId, userId)
//                .orElseThrow(() ->
//                        new WishlistNotFoundException(wishlistId));
//		 
//		 return modelMapper.map(wishlist, WishlistResponseDto.class);
//	}


	@Override
	public void removeFromWishlist(Long userId,Long productId) {

		Wishlist wishlist= repo.findByUserIdAndProduct_Id(userId, productId)
                .orElseThrow(() ->
                        new WishlistNotFoundException(userId));
		repo.delete(wishlist);
		
		log.info("Removed product {} for user {}", productId, userId);
	}

}
