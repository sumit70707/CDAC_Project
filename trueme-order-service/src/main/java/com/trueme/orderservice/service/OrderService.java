package com.trueme.orderservice.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.trueme.orderservice.dto.ApiResponseWithData;
import com.trueme.orderservice.dto.OrderResponseDto;

public interface OrderService {

	ApiResponseWithData<Page<OrderResponseDto>> getMyOrders(
	        Long userId,
	        int page,
	        int size
	);


    OrderResponseDto getOrderById(Long userId, Long orderId);
}
