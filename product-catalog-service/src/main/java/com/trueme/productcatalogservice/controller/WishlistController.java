package com.trueme.productcatalogservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.productcatalogservice.dto.WishlistResponseDto;
import com.trueme.productcatalogservice.service.WishlistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

	private final WishlistService wishlistService;
	
	@GetMapping("/{userId}")
	public ResponseEntity<?> getWishlistByUser(@PathVariable Long userId){
		
		return ResponseEntity.ok(wishlistService.getWishlistByUser(userId));
	}
	
	@PostMapping("/{userId}/{productId}")
    public ResponseEntity<WishlistResponseDto> addToWishlist(
    		@PathVariable Long userId,
            @PathVariable Long productId) {
		
		// TODO: Remove userId from path once authentication is implemented

        WishlistResponseDto responseDto = wishlistService.addToWishlist(userId, productId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(responseDto);
    }
	
	@DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
    		@PathVariable Long userId,
            @PathVariable Long productId) {

        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.noContent().build();
    }
}
