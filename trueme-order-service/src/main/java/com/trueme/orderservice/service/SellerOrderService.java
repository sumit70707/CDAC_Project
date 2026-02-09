package com.trueme.orderservice.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.dto.SellerOrderItemResponseDto;
import com.trueme.orderservice.dto.SellerOrderSummaryDto;
import com.trueme.orderservice.entity.enums.FulfillmentStatus;

public interface SellerOrderService {
	
	Page<SellerOrderItemResponseDto> getSellerOrders(
	        Long sellerId,
	        FulfillmentStatus status,
	        int page,
	        int size
	);


    ApiResponse updateFulfillmentStatus(
            Long sellerId,
            Long orderItemId,
            FulfillmentStatus status);

	SellerOrderSummaryDto getSellerOrderSummary(Long sellerId);

}
