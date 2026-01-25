package com.trueme.orderservice.service;

import java.util.List;

import com.trueme.orderservice.dto.ApiResponseWithData;
import com.trueme.orderservice.dto.OrderResponseDto;

public interface OrderService {

	ApiResponseWithData<List<OrderResponseDto>> getMyOrders(Long userId);

    OrderResponseDto getOrderById(Long userId, Long orderId);
}
