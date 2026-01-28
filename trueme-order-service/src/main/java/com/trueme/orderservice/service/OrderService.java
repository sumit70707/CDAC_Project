package com.trueme.orderservice.service;

import org.springframework.data.domain.Page;

import com.trueme.orderservice.dto.ApiResponseWithData;
import com.trueme.orderservice.dto.OrderResponseDto;
import com.trueme.orderservice.entity.enums.PaymentStatusFromPaymentService;

public interface OrderService {

	ApiResponseWithData<Page<OrderResponseDto>> getMyOrders(
	        Long userId,
	        int page,
	        int size
	);


    OrderResponseDto getOrderById(Long userId, Long orderId);
    
    void updatePaymentStatusByPaymentService(Long orderId,Long paymentId,
    		PaymentStatusFromPaymentService paymentStatusFromPaymentService);
}
