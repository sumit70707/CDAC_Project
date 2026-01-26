package com.trueme.orderservice.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.orderservice.dto.ApiResponseWithData;
import com.trueme.orderservice.dto.OrderItemResponseDto;
import com.trueme.orderservice.dto.OrderResponseDto;
import com.trueme.orderservice.entity.Order;
import com.trueme.orderservice.exception.order.OrderNotFoundException;
import com.trueme.orderservice.repository.OrderItemRepository;
import com.trueme.orderservice.repository.OrderRepository;
import com.trueme.orderservice.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final ModelMapper modelMapper;

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
}
