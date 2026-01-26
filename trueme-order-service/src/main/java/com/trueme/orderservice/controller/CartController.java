package com.trueme.orderservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;

    @PostMapping("/items")
    public ResponseEntity<ApiResponse> addToCart(
    		@AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AddToCartRequestDto request) {
    	
    	Long userId = jwt.getClaim("userId");
    	
        cartService.addItemToCart(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Item added to cart successfully","SUCCESS"));
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponseDto>> getCart(
    		@AuthenticationPrincipal Jwt jwt) {
    	
    	Long userId = jwt.getClaim("userId");
    	
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<ApiResponse> updateQuantity(
    		@AuthenticationPrincipal Jwt jwt,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequestDto request) {
    	
    	Long userId = jwt.getClaim("userId");
    	
        cartService.updateCartItemQuantity(userId, productId, request);

        return ResponseEntity.ok(
                new ApiResponse("Cart item quantity updated successfully","SUCCESS"));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse> removeItem(
    		@AuthenticationPrincipal Jwt jwt,
            @PathVariable Long productId) {
    	
    	Long userId = jwt.getClaim("userId");
    	
        cartService.removeItemFromCart(userId, productId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
        		.body(new ApiResponse( "Item removed from cart successfully","SUCCESS"));
    }
}
