package com.trueme.orderservice.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.dto.SellerOrderItemResponseDto;
import com.trueme.orderservice.dto.SellerOrderSummaryDto;
import com.trueme.orderservice.entity.Order;
import com.trueme.orderservice.entity.OrderItem;
import com.trueme.orderservice.entity.enums.FulfillmentStatus;
import com.trueme.orderservice.entity.enums.OrderStatus;
import com.trueme.orderservice.entity.enums.PaymentStatus;
import com.trueme.orderservice.exception.order.OrderItemAlreadyDeliveredException;
import com.trueme.orderservice.exception.order.OrderItemNotFoundException;
import com.trueme.orderservice.repository.OrderItemRepository;
import com.trueme.orderservice.service.SellerOrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SellerOrderServiceImpl implements SellerOrderService {

	private final OrderItemRepository orderItemRepository;

	@Override
	@Transactional(readOnly = true)
	public List<SellerOrderItemResponseDto> getSellerOrders(Long sellerId, FulfillmentStatus status) {

		log.info("Fetching seller orders for sellerId={}, status={}", sellerId, status);

		return orderItemRepository.findBySellerId(sellerId)
				.stream()
				.filter(item ->
				item.getOrder().getPaymentStatus() == PaymentStatus.COMPLETED)
				.filter(item ->
                status == null || item.getFulfillmentStatus() == status)
				.map(item -> SellerOrderItemResponseDto.builder()
						.orderItemId(item.getId())
						.orderId(item.getOrder().getId())
						.orderNumber(item.getOrder().getOrderNumber())
						.productId(item.getProductId())
						.productName(item.getProductName())
						.quantity(item.getQuantity())
						.subtotal(item.getSubtotal())
						.fulfillmentStatus(item.getFulfillmentStatus())
						.build())
				.toList();
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

		// seller ownership check
		if (!orderItem.getSellerId().equals(sellerId)) {
			throw new OrderItemNotFoundException(orderItemId);
		}

		// already delivered → cannot update
		if (orderItem.getFulfillmentStatus() == FulfillmentStatus.DELIVERED) {
			throw new OrderItemAlreadyDeliveredException(orderItemId);
		}

		// minimal validation
		orderItem.setFulfillmentStatus(status);
		updateOrderStatus(orderItem.getOrder());
		orderItemRepository.save(orderItem);

		return new ApiResponse("Fulfillment status updated successfully","SUCCESS");
	}
	
	@Transactional(readOnly = true)
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


}
