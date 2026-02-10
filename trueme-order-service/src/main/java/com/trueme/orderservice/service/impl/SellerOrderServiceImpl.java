package com.trueme.orderservice.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.orderservice.client.AuthClient;
import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.dto.OrderEventDto;
import com.trueme.orderservice.dto.OrderItemEventDto;
import com.trueme.orderservice.dto.SellerOrderItemResponseDto;
import com.trueme.orderservice.dto.SellerOrderSummaryDto;
import com.trueme.orderservice.dto.UserDetailsDto;
import com.trueme.orderservice.entity.Order;
import com.trueme.orderservice.entity.OrderItem;
import com.trueme.orderservice.entity.enums.FulfillmentStatus;
import com.trueme.orderservice.entity.enums.OrderEventType;
import com.trueme.orderservice.entity.enums.OrderStatus;
import com.trueme.orderservice.entity.enums.PaymentStatus;
import com.trueme.orderservice.errorcode.ServiceErrorCode;
import com.trueme.orderservice.exception.ServiceUnavailableException;
import com.trueme.orderservice.exception.order.OrderItemAlreadyDeliveredException;
import com.trueme.orderservice.exception.order.OrderItemNotFoundException;
import com.trueme.orderservice.kafka.OrderNotificationProducer;
import com.trueme.orderservice.repository.OrderItemRepository;
import com.trueme.orderservice.service.SellerOrderService;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SellerOrderServiceImpl implements SellerOrderService {

	private final OrderItemRepository orderItemRepository;
	private final AuthClient authClient;
	private final OrderNotificationProducer orderNotificationProducer;

	@Override
	public Page<SellerOrderItemResponseDto> getSellerOrders(
	        Long sellerId,
	        FulfillmentStatus status,
	        int page,
	        int size) {

	    log.info("Fetching seller orders sellerId={}, status={}, page={}, size={}",
	            sellerId, status, page, size);

	    Pageable pageable = PageRequest.of(
	            page,
	            size,
	            Sort.by(Sort.Direction.DESC, "createdAt") //ASC by created time
	    );

	    return orderItemRepository
	            .findSellerOrders(sellerId, status, pageable)
	            .map(item -> SellerOrderItemResponseDto.builder()
	                    .orderItemId(item.getId())
	                    .orderId(item.getOrder().getId())
	                    .orderNumber(item.getOrder().getOrderNumber())
	                    .productId(item.getProductId())
	                    .productName(item.getProductName())
	                    .quantity(item.getQuantity())
	                    .subtotal(item.getSubtotal())
	                    .fulfillmentStatus(item.getFulfillmentStatus())
	                    .build());
	}


	@Override
	public ApiResponse updateFulfillmentStatus(
			Long sellerId,
			Long orderItemId,
			FulfillmentStatus status) {

		log.info("Updating fulfillment status | sellerId={} orderItemId={} status={}",
				sellerId, orderItemId, status);

		OrderItem orderItem = orderItemRepository.findById(orderItemId)
				.orElseThrow(() -> new OrderItemNotFoundException(orderItemId));
		
		String orderNumber=orderItem.getOrder().getOrderNumber();
		
		Long userId = orderItem.getOrder().getUserId();
		
		PaymentStatus paymentStatus=orderItem.getOrder().getPaymentStatus();
		
		BigDecimal totalAmount=orderItem.getOrder().getTotalAmount();

		// seller ownership check
		if (!orderItem.getSellerId().equals(sellerId)) {
			throw new OrderItemNotFoundException(orderItemId);
		}

		// already delivered → cannot update
		if (orderItem.getFulfillmentStatus() == FulfillmentStatus.DELIVERED) {
			throw new OrderItemAlreadyDeliveredException(orderItemId);
		}

		orderItem.setFulfillmentStatus(status);
		updateOrderStatus(orderItem.getOrder());
		orderItemRepository.save(orderItem);
		
		//get usr details first
		UserDetailsDto userDetails = getUserDetailsSafely(userId);
		
	    // GENERATE ITEM_STATUS_UPDATED  EVENT

	    OrderItemEventDto updatedItemEvent =
	            new OrderItemEventDto(
	                    orderItem.getProductName(),
	                    orderItem.getQuantity(),
	                    orderItem.getUnitPrice(),
	                    status
	            );

	    OrderEventDto orderEvent =
	            new OrderEventDto(
	                    OrderEventType.ITEM_STATUS_UPDATED,
	                    orderNumber,
	                    userDetails.getUserName(),     
	                    userDetails.getEmail(),    
	                    paymentStatus,
	                    List.of(updatedItemEvent),          // ONLY updated item
	                    totalAmount);

	    // Publish 
	    orderNotificationProducer.publishOrderEvent(orderEvent);

		return new ApiResponse("Fulfillment status updated successfully","SUCCESS");
	}
	
	
	
	private void updateOrderStatus(Order order) {

	    List<OrderItem> items =
	            orderItemRepository.findByOrderId(order.getId());

	    boolean allDelivered = items.stream()
	            .allMatch(i ->
	                i.getFulfillmentStatus() == FulfillmentStatus.DELIVERED
	            );

	    boolean allReturned = items.stream()
	            .allMatch(i ->
	                i.getFulfillmentStatus() == FulfillmentStatus.RETURNED
	            );

	    boolean anyShipped = items.stream()
	            .anyMatch(i ->
	                i.getFulfillmentStatus() == FulfillmentStatus.SHIPPED
	            );

	    boolean anyProcessing = items.stream()
	            .anyMatch(i ->
	                i.getFulfillmentStatus() == FulfillmentStatus.PROCESSING
	            );

	    if (allDelivered) {
	        order.setOrderStatus(OrderStatus.DELIVERED);

	    } else if (allReturned) {
	        order.setOrderStatus(OrderStatus.CANCELLED);

	    } else if (anyShipped) {
	        order.setOrderStatus(OrderStatus.SHIPPED);

	    } else if (anyProcessing) {
	        order.setOrderStatus(OrderStatus.PENDING);

	    } else {
	        order.setOrderStatus(OrderStatus.CREATED);
	    }
	}
	
	public SellerOrderSummaryDto getSellerOrderSummary(Long sellerId) {

	    List<OrderItem> items = orderItemRepository.findBySellerId(sellerId)
	            .stream()
	            .filter(item ->
	                item.getOrder().getPaymentStatus() == PaymentStatus.COMPLETED
	            )
	            .toList();

	    long totalOrders = items.size();

	    List<OrderItem> deliveredItems = items.stream()
	            .filter(item -> item.getFulfillmentStatus() == FulfillmentStatus.DELIVERED)
	            .toList();

	    long deliveredOrders = deliveredItems.size();

	    BigDecimal totalIncome = deliveredItems.stream()
	            .map(OrderItem::getSubtotal)
	            .reduce(BigDecimal.ZERO, BigDecimal::add);

	    return SellerOrderSummaryDto.builder()
	            .totalOrders(totalOrders)
	            .deliveredOrders(deliveredOrders)
	            .totalIncome(totalIncome)
	            .build();
	}
	
	@CircuitBreaker(
	        name = "authService",
	        fallbackMethod = "userDetailsFallback"
	)
	public UserDetailsDto getUserDetailsSafely(Long userId) {
	    return authClient.getUserDetails(userId);
	}

	public UserDetailsDto userDetailsFallback(
	        Long userId){

		log.error("Auth service unavailable while fetching address for userId={}", userId);

	    throw new ServiceUnavailableException(ServiceErrorCode.SERVICE_503,"Auth service is temporarily unavailable. Please try again later.");
	}


}
