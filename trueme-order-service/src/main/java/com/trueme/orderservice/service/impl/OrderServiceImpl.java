package com.trueme.orderservice.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.orderservice.client.AuthClient;
import com.trueme.orderservice.client.ProductClient;
import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.dto.ApiResponseWithData;
import com.trueme.orderservice.dto.IncreaseStockRequest;
import com.trueme.orderservice.dto.OrderEventDto;
import com.trueme.orderservice.dto.OrderItemEventDto;
import com.trueme.orderservice.dto.OrderItemResponseDto;
import com.trueme.orderservice.dto.OrderResponseDto;
import com.trueme.orderservice.dto.UserDetailsDto;
import com.trueme.orderservice.entity.Order;
import com.trueme.orderservice.entity.OrderItem;
import com.trueme.orderservice.entity.enums.FulfillmentStatus;
import com.trueme.orderservice.entity.enums.OrderEventType;
import com.trueme.orderservice.entity.enums.OrderStatus;
import com.trueme.orderservice.entity.enums.PaymentStatus;
import com.trueme.orderservice.entity.enums.PaymentStatusFromPaymentService;
import com.trueme.orderservice.exception.order.OrderCancellationNotAllowedException;
import com.trueme.orderservice.exception.order.OrderNotFoundException;
import com.trueme.orderservice.kafka.OrderNotificationProducer;
import com.trueme.orderservice.repository.OrderItemRepository;
import com.trueme.orderservice.repository.OrderRepository;
import com.trueme.orderservice.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final ModelMapper modelMapper;
	private final ProductClient productClient;
	private final AuthClient authClient;
	private final OrderNotificationProducer orderNotificationProducer;

	public ApiResponseWithData<Page<OrderResponseDto>> getMyOrders(
	        Long userId,
	        int page,
	        int size) {

	    log.info("Fetching orders for userId={}, page={}, size={}",
	            userId, page, size);

	    Pageable pageable = PageRequest.of(
	            page,
	            size,
	            Sort.by(Sort.Direction.DESC, "createdAt")
	    );

	    Page<OrderResponseDto> ordersPage = orderRepository
	            .findByUserId(userId, pageable)
	            .map(order -> mapToOrderResponse(order, true));

	    if (ordersPage.isEmpty()) {
	        return new ApiResponseWithData<>(
	                "No orders found","SUCCESS",ordersPage);
	    }

	    return new ApiResponseWithData<>(
	            "Orders fetched successfully","SUCCESS",ordersPage);
	}
	
	
	public ApiResponse cancelOrder(Long userId, Long orderId) {

	    log.info("Cancel order request received: userId={}, orderId={}", userId, orderId);

	    // 1️ Fetch order
	    Order order = orderRepository.findById(orderId)
	            .orElseThrow(() -> new OrderNotFoundException(orderId));

	    // 2️ Ownership check
	    if (!order.getUserId().equals(userId)) {
	        throw new OrderNotFoundException(orderId);
	    }

	    // 3️ Already cancelled check
	    if (order.getOrderStatus() == OrderStatus.CANCELLED) {
	        return new ApiResponse("Order already cancelled", "SUCCESS");
	    }

	    // 4️ Fetch order items
	    List<OrderItem> orderItems =
	            orderItemRepository.findByOrderId(orderId);

	    if (orderItems.isEmpty()) {
	        throw new IllegalStateException("Order has no items");
	    }

	    // 5️ Validate cancellation rule
	    boolean canCancel = orderItems.stream()
	            .allMatch(item ->
	                    item.getFulfillmentStatus() == FulfillmentStatus.PENDING
	                 || item.getFulfillmentStatus() == FulfillmentStatus.PROCESSING
	            );

	    if (!canCancel) {
	        throw new OrderCancellationNotAllowedException(orderId);
	    }

	 // 6️ Cancel all order items + restore stock
	    for (OrderItem item : orderItems) {

	        // restore stock
	        productClient.increaseStock(
	                item.getProductId(),
	                new IncreaseStockRequest(item.getQuantity())
	        );

	        // mark item cancelled
	        item.setFulfillmentStatus(FulfillmentStatus.CANCELLED);
	    }

	    orderItemRepository.saveAll(orderItems);

	 // 7️ Cancel order + update payment status
	    order.setOrderStatus(OrderStatus.CANCELLED);

	    if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
	        order.setPaymentStatus(PaymentStatus.REFUNDED);
	    }

	    orderRepository.save(order);



	    log.info("Order cancelled successfully: orderId={}", orderId);
	    
	    List<OrderItemEventDto> itemEvents = orderItems.stream()
	            .map(item -> new OrderItemEventDto(
	                    item.getProductName(),
	                    item.getQuantity(),
	                    item.getUnitPrice(),
	                    FulfillmentStatus.CANCELLED
	            )).toList();
	    
	    UserDetailsDto userDetails = authClient.getUserDetails(userId);
	    
	    OrderEventDto cancelEvent = new OrderEventDto(
	            OrderEventType.ORDER_CANCELLED,
	            order.getOrderNumber(),
	            userDetails.getUserName(),
	            userDetails.getEmail(),
	            order.getPaymentStatus(),      
	            itemEvents,
	            order.getTotalAmount()         // FULL REFUND AMOUNT
	    );

	    orderNotificationProducer.publishOrderEvent(cancelEvent);

	    return new ApiResponse("Order cancelled successfully", "SUCCESS");
	}

	
	@Override
	public OrderResponseDto getOrderById(Long userId, Long orderId) {

		log.info("Fetching orderId={} for userId={}", orderId, userId);

		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new OrderNotFoundException(orderId));

		// security check (ownership)
		if (!order.getUserId().equals(userId)) {
			throw new OrderNotFoundException(orderId);
		}

		return mapToOrderResponse(order, true);
	}

	// private mappeer 
	private OrderResponseDto mapToOrderResponse(Order order, boolean includeItems) {

		OrderResponseDto response = OrderResponseDto.builder()
				.orderId(order.getId())
				.orderNumber(order.getOrderNumber())
				.totalAmount(order.getTotalAmount())
				.currency(order.getCurrency())
				.paymentStatus(order.getPaymentStatus())
				.orderStatus(order.getOrderStatus())
				.createdAt(order.getCreatedAt())
				.build();

		if (includeItems) {
			List<OrderItemResponseDto> items = orderItemRepository
					.findByOrderId(order.getId())
					.stream()
					.map(item -> modelMapper.map(item, OrderItemResponseDto.class))
					.toList();

			response.setItems(items);
		}

		return response;
	}

	@Transactional
	public void updatePaymentStatusByPaymentService(
	        Long orderId,
	        Long paymentId,
	        PaymentStatusFromPaymentService paymentStatusFromPaymentService) {

	    // 1️ Fetch order
	    Order order = orderRepository.findById(orderId)
	            .orElseThrow(() ->new OrderNotFoundException(orderId));

	    // 2️ Idempotency guard
	    // If payment is already completed, ignore duplicate webhook calls
	    if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
	        log.warn(
	            "Ignoring payment update. Order payment already completed | orderId={}",
	            orderId);
	        return;
	    }

	    // 3️ Map payment-service status → order-service payment status
	    PaymentStatus paymentStatus =
	            mapFromPaymentServiceStatus(paymentStatusFromPaymentService);

	    // 4️ Update ONLY payment status
	    order.setPaymentStatus(paymentStatus);
	    
	    //update paymnet ID also
	    order.setPaymentId(paymentId);

	    // 5️ save changes
	    orderRepository.save(order);
	}

	
	private PaymentStatus mapFromPaymentServiceStatus(
	        PaymentStatusFromPaymentService status) {

	    return switch (status) {
	        case COMPLETED -> PaymentStatus.COMPLETED;
	        case FAILED -> PaymentStatus.FAILED;
	        case REFUNDED -> PaymentStatus.REFUNDED;
	        default -> PaymentStatus.PENDING;
	    };
	}


}
