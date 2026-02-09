package com.trueme.orderservice.service;

import java.util.List;

import com.trueme.orderservice.dto.AddToCartRequestDto;
import com.trueme.orderservice.dto.CartItemResponseDto;
import com.trueme.orderservice.dto.UpdateCartItemRequestDto;

public interface CartService {

    void addItemToCart(Long userId, AddToCartRequestDto request);

    List<CartItemResponseDto> getCartItems(Long userId);

    void updateCartItemQuantity(
            Long userId,
            Long productId,
            UpdateCartItemRequestDto request);

    void removeItemFromCart(Long userId, Long productId);
}
