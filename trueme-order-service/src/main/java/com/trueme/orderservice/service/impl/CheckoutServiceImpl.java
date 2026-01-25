package com.trueme.orderservice.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.entity.Cart;
import com.trueme.orderservice.entity.CartItem;
import com.trueme.orderservice.entity.Order;
import com.trueme.orderservice.entity.OrderItem;
import com.trueme.orderservice.entity.enums.CartStatus;
import com.trueme.orderservice.entity.enums.OrderStatus;
import com.trueme.orderservice.entity.enums.PaymentStatus;
import com.trueme.orderservice.exception.cart.CartNotFoundException;
import com.trueme.orderservice.exception.order.EmptyCartForOrderException;
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


	@Override
	public ApiResponse checkout(Long userId) {

	    log.info("Checkout started for userId={}", userId);

	    // 1️ Fetch ACTIVE cart 
	    Cart cart = cartRepository.findByUserIdAndActiveTrue(userId)
	            .orElseThrow(() -> new CartNotFoundException(userId));

	    List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

	    if (cartItems.isEmpty()) {
	        throw new EmptyCartForOrderException(userId);
	    }

	    // 2️ Create Order
	    Order order = Order.builder()
	            .orderNumber(UUID.randomUUID().toString())
	            .userId(userId)
	            .shippingAddressSnapshot(buildDummyAddressSnapshot(userId)) // dummy
	            .paymentStatus(PaymentStatus.COMPLETED) // dummy
	            .orderStatus(OrderStatus.CREATED)
	            .totalAmount(calculateTotal(cartItems))
	            .currency("INR")
	            .build();

	    orderRepository.save(order);

	    // 3️ Create OrderItems
	    for (CartItem cartItem : cartItems) {

	        OrderItem orderItem = OrderItem.builder()
	                .order(order)
	                .productId(cartItem.getProductId())
	                .sellerId(cartItem.getSellerId())
	                .productName(dummyProductName(cartItem.getProductId())) // dummy
	                .imageUrl(dummyProductImage()) // dummy
	                .unitPrice(cartItem.getPriceSnapshot())
	                .quantity(cartItem.getQuantity())
	                .subtotal(
	                        cartItem.getPriceSnapshot()
	                                .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
	                )
	                .build();

	        orderItemRepository.save(orderItem);
	    }

	    // 4️ VERY IMPORTANT: deactivate cart
	    cart.setActive(false);                    //REQUIRED make this cart as false
	    cart.setStatus(CartStatus.CHECKED_OUT);   // lifecycle info
	    cartRepository.save(cart);

	    log.info("Checkout completed successfully for userId={}, orderId={}",
	            userId, order.getId());

	    return new ApiResponse(
	            "Order placed successfully. OrderNumber: " + order.getOrderNumber(),
	            "SUCCESS"
	    );
	}


	private BigDecimal calculateTotal(List<CartItem> cartItems) {
		return cartItems.stream()
				.map(item -> item.getPriceSnapshot()
						.multiply(BigDecimal.valueOf(item.getQuantity())))
				.reduce(BigDecimal.ZERO, BigDecimal::add);
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
	
	private String dummyProductName(Long productId) {
	    return "Product-" + productId;
	}
	
	private String dummyProductImage() {
	    return "https://dummy.image/product.png";
	}




}
