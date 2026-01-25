package com.trueme.orderservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.orderservice.dto.AddToCartRequestDto;
import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.dto.CartItemResponseDto;
import com.trueme.orderservice.dto.UpdateCartItemRequestDto;
import com.trueme.orderservice.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // TEMP: userId via request param (JWT later)
    @PostMapping("/items")
    public ResponseEntity<ApiResponse> addToCart(
            @RequestParam Long userId,
            @Valid @RequestBody AddToCartRequestDto request) {
    	
        cartService.addItemToCart(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Item added to cart successfully","SUCCESS"));
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponseDto>> getCart(
            @RequestParam Long userId) {
    	
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<ApiResponse> updateQuantity(
            @RequestParam Long userId,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequestDto request) {
    	
        cartService.updateCartItemQuantity(userId, productId, request);

        return ResponseEntity.ok(
                new ApiResponse("Cart item quantity updated successfully","SUCCESS"));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse> removeItem(
            @RequestParam Long userId,
            @PathVariable Long productId) {
    	
        cartService.removeItemFromCart(userId, productId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
        		.body(new ApiResponse( "Item removed from cart successfully","SUCCESS"));
    }
}
