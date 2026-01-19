package com.trueme.productcatalogservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.productcatalogservice.service.WishlistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

	private final WishlistService wishlistService;
	
	@GetMapping("")
	public ResponseEntity<?> getWishlistByUser(@RequestParam Long userId){
		
		return ResponseEntity.ok(wishlistService.getWishlistByUser(userId));
	}
}
