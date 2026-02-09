package com.trueme.orderservice.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trueme.orderservice.client.AuthClient;
import com.trueme.orderservice.client.PaymentClient;
import com.trueme.orderservice.client.ProductClient;
import com.trueme.orderservice.dto.AddressResponseDto;
import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.dto.OrderEventDto;
import com.trueme.orderservice.dto.OrderItemEventDto;
import com.trueme.orderservice.dto.PaymentCheckoutRequest;
import com.trueme.orderservice.dto.PaymentCheckoutResponseDto;
import com.trueme.orderservice.dto.ProductResponseDto;
import com.trueme.orderservice.dto.ReduceStockRequest;
import com.trueme.orderservice.dto.UserDetailsDto;
import com.trueme.orderservice.entity.Cart;
import com.trueme.orderservice.entity.CartItem;
import com.trueme.orderservice.entity.Order;
import com.trueme.orderservice.entity.OrderItem;
import com.trueme.orderservice.entity.enums.CartStatus;
import com.trueme.orderservice.entity.enums.FulfillmentStatus;
import com.trueme.orderservice.entity.enums.OrderEventType;
import com.trueme.orderservice.entity.enums.OrderStatus;
import com.trueme.orderservice.entity.enums.PaymentStatus;
import com.trueme.orderservice.entity.enums.ProductStatus;
import com.trueme.orderservice.exception.cart.CartNotFoundException;
import com.trueme.orderservice.exception.order.AddressNotFoundException;
import com.trueme.orderservice.exception.order.EmptyCartForOrderException;
import com.trueme.orderservice.exception.product.InsufficientStockException;
import com.trueme.orderservice.exception.product.ProductInactiveException;
import com.trueme.orderservice.kafka.OrderNotificationProducer;
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
	private final AuthClient authClient;
	private final ObjectMapper objectMapper;
	private Long addressId;
	private final PaymentClient paymentClient;
	private final OrderNotificationProducer orderNotificationProducer;
	List<OrderItemEventDto> orderItemEvents = new ArrayList<>();



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
		
		final String orderNumber=UUID.randomUUID().toString();
		
		// 2️ Create Order FIRST with zero total
		// (total will be calculated after validating products)
		Order order = Order.builder()
				.orderNumber(orderNumber)
				.userId(userId)
				.shippingAddressSnapshot(buildAddressSnapshot(userId))
				.shippingAddressId(addressId)
				.paymentStatus(PaymentStatus.PENDING)                    
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
			
			//build OrderItemEventDto for email
		     orderItemEvents.add(
		                new OrderItemEventDto(
		                        product.getName(),
		                        cartItem.getQuantity(),
		                        product.getPrice(),
		                        FulfillmentStatus.PENDING
		                )
		        );
			
			
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
		
		//get usr details first
		UserDetailsDto userDetails = authClient.getUserDetails(userId);
		
	    //  KAFKA ORDER_CREATED EVENT
	    OrderEventDto orderEvent = new OrderEventDto(
	            OrderEventType.ORDER_CREATED,
	            order.getOrderNumber(),
	            userDetails.getUserName(),         
	            userDetails.getEmail(),         
	            PaymentStatus.PENDING,
	            orderItemEvents,              // ALL items
	            orderTotal
	    );

	    // Publish  
	    orderNotificationProducer.publishOrderEvent(orderEvent);


		// 6 call paymey service
		PaymentCheckoutResponseDto paymentResponse =
	            paymentClient.createCheckout(
	                    PaymentCheckoutRequest.builder()
	                            .orderId(order.getId())
	                            .orderNumber(orderNumber)
	                            .userId(userId)
	                            .amount(orderTotal)
	                            .currency("INR")
	                            .build());

	    log.info(
	        "Checkout initiated for orderId={}, redirecting to Stripe",
	        order.getId());

	    // 7️ retrumn paymeny url for frontend 
	    return new ApiResponse(
	            paymentResponse.getCheckoutUrl(),
	            "PAYMENT_URL");
	}
	
	private String buildAddressSnapshot(Long userId) {

	    AddressResponseDto address;

	    try {
	        address = authClient.getDefaultAddress(userId);
	    } catch (Exception ex) {
	        log.error("Failed to fetch address for userId={}", userId, ex);
	        throw new AddressNotFoundException(userId);
	    }

	    if (address == null) {
	        throw new AddressNotFoundException(userId);
	    }

	    this.addressId = address.getId();

	    try {
	        return objectMapper.writeValueAsString(address);
	    } catch (JsonProcessingException e) {
	        throw new RuntimeException("Failed to serialize address snapshot", e);
	    }
	}



}
