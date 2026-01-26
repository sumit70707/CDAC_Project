package com.trueme.orderservice.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trueme.orderservice.client.AddressClient;
import com.trueme.orderservice.client.ProductClient;
import com.trueme.orderservice.dto.AddressResponseDto;
import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.dto.ProductResponseDto;
import com.trueme.orderservice.dto.ReduceStockRequest;
import com.trueme.orderservice.entity.Cart;
import com.trueme.orderservice.entity.CartItem;
import com.trueme.orderservice.entity.Order;
import com.trueme.orderservice.entity.OrderItem;
import com.trueme.orderservice.entity.enums.CartStatus;
import com.trueme.orderservice.entity.enums.OrderStatus;
import com.trueme.orderservice.entity.enums.PaymentStatus;
import com.trueme.orderservice.entity.enums.ProductStatus;
import com.trueme.orderservice.exception.cart.CartNotFoundException;
import com.trueme.orderservice.exception.order.EmptyCartForOrderException;
import com.trueme.orderservice.exception.product.InsufficientStockException;
import com.trueme.orderservice.exception.product.ProductInactiveException;
import com.trueme.orderservice.repository.CartItemRepository;
import com.trueme.orderservice.repository.CartRepository;
import com.trueme.orderservice.repository.OrderItemRepository;
import com.trueme.orderservice.repository.OrderRepository;
import com.trueme.orderservice.service.CheckoutService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CheckoutServiceImpl implements CheckoutService {

	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final ProductClient productClient;
	private final AddressClient addressClient;
	private final ObjectMapper objectMapper;


	@Override
	public ApiResponse checkout(Long userId) {

		log.info("Checkout started for userId={}", userId);

		// 1️ Fetch ACTIVE cart only
		Cart cart = cartRepository.findByUserIdAndActiveTrue(userId)
				.orElseThrow(() -> new CartNotFoundException(userId));

		List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

		if (cartItems.isEmpty()) {
			throw new EmptyCartForOrderException(userId);
		}

		// 2️ Create Order FIRST with zero total
		// (total will be calculated after validating products)
		Order order = Order.builder()
				.orderNumber(UUID.randomUUID().toString())
				.userId(userId)
				.shippingAddressSnapshot(buildAddressSnapshot(userId)) // dummy for now
				.paymentStatus(PaymentStatus.COMPLETED)                     // dummy for now
				.orderStatus(OrderStatus.CREATED)
				.currency("INR")
				.totalAmount(BigDecimal.ZERO)
				.build();

		orderRepository.save(order);

		// 3️ Create OrderItems + calculate total using Product Service
		BigDecimal orderTotal = BigDecimal.ZERO;

		for (CartItem cartItem : cartItems) {

			// Fetch product from Product Catalog Service
			ProductResponseDto product =
					productClient.getProductById(cartItem.getProductId());

			// Product must be AVAILABLE
			if (!ProductStatus.AVAILABLE.name()
					.equals(product.getProductStatus())) {
				throw new ProductInactiveException(product.getId());
			}

			// Stock validation
			if (product.getQty() < cartItem.getQuantity()) {
				throw new InsufficientStockException(product.getId());
			}

			// Recalculate subtotal 
			BigDecimal subtotal = product.getPrice()
					.multiply(BigDecimal.valueOf(cartItem.getQuantity()));

			OrderItem orderItem = OrderItem.builder()
					.order(order)
					.productId(product.getId())
					.sellerId(product.getSellerId())
					.productName(product.getName())
					.imageUrl(product.getImageUrl())
					.unitPrice(product.getPrice())
					.quantity(cartItem.getQuantity())
					.subtotal(subtotal)
					.build();

			orderItemRepository.save(orderItem);
			
			//decrease stock 
			productClient.reduceStock(
		            product.getId(),new ReduceStockRequest(cartItem.getQuantity()));

			// accumulate order total
			orderTotal = orderTotal.add(subtotal);
		}

		// 4️ Update final order total
		order.setTotalAmount(orderTotal);

		// 5️  deactivate cart after use
		cart.setActive(false);                    // no longer usable
		cart.setStatus(CartStatus.CHECKED_OUT);   // lifecycle info
		cartRepository.save(cart);

		log.info("Checkout completed successfully for userId={}, orderId={}",
				userId, order.getId());

		return new ApiResponse(
				"Order placed successfully. OrderNumber: " + order.getOrderNumber(),
				"SUCCESS");
	}
	
	private String buildAddressSnapshot(Long userId) {

	    try {
	        AddressResponseDto address =
	                addressClient.getDefaultAddress(userId);

	        return objectMapper.writeValueAsString(address);

	    } catch (Exception ex) {
	        log.warn("Address service unavailable, using dummy address", ex);
	        return buildDummyAddressSnapshot(userId); // fallback
	    }
	}


	private String buildDummyAddressSnapshot(Long userId) {
		return """
				{
				  "userId": %d,
				  "name": "Test User",
				  "addressLine1": "Test Street 123",
				  "city": "Pune",
				  "state": "MH",
				  "pincode": "411001",
				  "country": "India"
				}
				""".formatted(userId);
	}


}
