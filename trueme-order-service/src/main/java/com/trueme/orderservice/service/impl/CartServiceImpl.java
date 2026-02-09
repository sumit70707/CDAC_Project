package com.trueme.orderservice.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.orderservice.client.ProductClient;
import com.trueme.orderservice.dto.AddToCartRequestDto;
import com.trueme.orderservice.dto.CartItemResponseDto;
import com.trueme.orderservice.dto.ProductResponseDto;
import com.trueme.orderservice.dto.UpdateCartItemRequestDto;
import com.trueme.orderservice.entity.Cart;
import com.trueme.orderservice.entity.CartItem;
import com.trueme.orderservice.entity.enums.CartStatus;
import com.trueme.orderservice.entity.enums.ProductStatus;
import com.trueme.orderservice.exception.cart.CartAlreadyCheckedOutException;
import com.trueme.orderservice.exception.cart.CartItemNotFoundException;
import com.trueme.orderservice.exception.cart.InvalidCartQuantityException;
import com.trueme.orderservice.exception.product.InsufficientStockException;
import com.trueme.orderservice.exception.product.ProductInactiveException;
import com.trueme.orderservice.repository.CartItemRepository;
import com.trueme.orderservice.repository.CartRepository;
import com.trueme.orderservice.service.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final ModelMapper modelMapper;
	private final ProductClient productClient;

	Long sellerId = 5L; // TEMP dummy seller

	@Override
	public void addItemToCart(Long userId, AddToCartRequestDto request) {

		log.info("Adding productId={} to cart for userId={}", request.getProductId(), userId);

		if (request.getQuantity() == null || request.getQuantity() <= 0) {
			throw new InvalidCartQuantityException(request.getQuantity());
		}
		
		//Fetch product from Product Catalog Service
		ProductResponseDto product =
		        productClient.getProductById(request.getProductId());

		// availability check
		if (!ProductStatus.AVAILABLE.name()
		        .equals(product.getProductStatus())) {
		    throw new ProductInactiveException(product.getId());
		}

		// stock check
		if (product.getQty() < request.getQuantity()) {
		    throw new InsufficientStockException(product.getId());
		}

		// Fetch or create ACTIVE cart
		Cart cart = getOrCreateActiveCart(userId);

		if (cart.getStatus() == CartStatus.CHECKED_OUT) {
			throw new CartAlreadyCheckedOutException(cart.getId());
		}

		CartItem cartItem = cartItemRepository
				.findByCartIdAndProductId(cart.getId(), request.getProductId())
				.orElse(null);

		if (cartItem != null) {
			cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
			cartItemRepository.save(cartItem);
			return;
		}

		CartItem newItem = CartItem.builder()
		        .cart(cart)
		        .productId(product.getId())
		        .sellerId(product.getSellerId())
		        .productName(product.getName())
		        .productImage(product.getImageUrl())
		        .priceSnapshot(product.getPrice())
		        .quantity(request.getQuantity())
		        .build();


		cartItemRepository.save(newItem);
	}

	@Override
	public List<CartItemResponseDto> getCartItems(Long userId) {

	    log.info("Fetching cart items for userId={}", userId);

	    Optional<Cart> cartOpt = getActiveCart(userId);

	    // No active cart → cart is empty
	    if (cartOpt.isEmpty()) {
	        return List.of(); // frontend shows "Cart is empty"
	    }

	    Cart cart = cartOpt.get();

	    return cartItemRepository.findByCartId(cart.getId())
	            .stream()
	            .map(item -> modelMapper.map(item, CartItemResponseDto.class))
	            .toList();
	}

	@Override
	public void updateCartItemQuantity(
	        Long userId,
	        Long productId,
	        UpdateCartItemRequestDto request) {

	    log.info("Updating quantity for productId={} userId={}", productId, userId);

	    if (request.getQuantity() == null || request.getQuantity() <= 0) {
	        throw new InvalidCartQuantityException(request.getQuantity());
	    }

	    Cart cart = getActiveCart(userId)
	            .orElseThrow(() -> new CartAlreadyCheckedOutException(userId));

	    CartItem cartItem = cartItemRepository
	            .findByCartIdAndProductId(cart.getId(), productId)
	            .orElseThrow(() -> new CartItemNotFoundException(productId));

	    cartItem.setQuantity(request.getQuantity());
	    cartItemRepository.save(cartItem);
	}


	@Override
	public void removeItemFromCart(Long userId, Long productId) {

	    log.info("Removing productId={} userId={}", productId, userId);

	    Cart cart = getActiveCart(userId)
	            .orElseThrow(() -> new CartAlreadyCheckedOutException(userId));

	    CartItem cartItem = cartItemRepository
	            .findByCartIdAndProductId(cart.getId(), productId)
	            .orElseThrow(() -> new CartItemNotFoundException(productId));

	    cartItemRepository.delete(cartItem);
	}

	
	private Cart getOrCreateActiveCart(Long userId) {

	    return cartRepository.findByUserIdAndActiveTrue(userId)
	            .orElseGet(() -> {
	                log.info("Creating new ACTIVE cart for userId={}", userId);

	                Cart cart = Cart.builder()
	                        .userId(userId)
	                        .active(true)         //crerate cart withstatus true      
	                        .status(CartStatus.ACTIVE)  // lifecycle info
	                        .build();

	                return cartRepository.save(cart);
	            });
	}

	
	private Optional<Cart> getActiveCart(Long userId) {
		
	    return cartRepository.findByUserIdAndActiveTrue(userId);
	}


}
