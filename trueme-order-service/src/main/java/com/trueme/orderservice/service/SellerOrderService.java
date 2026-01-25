package com.trueme.orderservice.service;

import java.util.List;

import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.dto.SellerOrderItemResponseDto;
import com.trueme.orderservice.dto.SellerOrderSummaryDto;
import com.trueme.orderservice.entity.enums.FulfillmentStatus;

public interface SellerOrderService {
	
	List<SellerOrderItemResponseDto> getSellerOrders(Long sellerId, FulfillmentStatus status);

    ApiResponse updateFulfillmentStatus(
            Long sellerId,
            Long orderItemId,
            FulfillmentStatus status);

	SellerOrderSummaryDto getSellerOrderSummary(Long sellerId);

}
