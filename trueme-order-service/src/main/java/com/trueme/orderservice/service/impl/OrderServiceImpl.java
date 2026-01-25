package com.trueme.orderservice.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.orderservice.dto.ApiResponse;
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

	@Override
	public ApiResponseWithData<List<OrderResponseDto>> getMyOrders(Long userId) {

		log.info("Fetching orders for userId={}", userId);

		List<OrderResponseDto> orders = orderRepository.findByUserId(userId)
				.stream()
				.map(order -> mapToOrderResponse(order, true))
				.toList();

		if (orders.isEmpty()) {
			return new ApiResponseWithData<>(
					"No orders found","SUCCESS",orders);
		}

		return new ApiResponseWithData<>(
				"Orders fetched successfully","SUCCESS",orders);
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
