package com.trueme.orderservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.dto.SellerOrderItemResponseDto;
import com.trueme.orderservice.dto.SellerOrderSummaryDto;
import com.trueme.orderservice.entity.enums.FulfillmentStatus;
import com.trueme.orderservice.service.SellerOrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
public class SellerOrderController {

    private final SellerOrderService sellerOrderService;

    @GetMapping
    public ResponseEntity<List<SellerOrderItemResponseDto>> getSellerOrders(
            @RequestParam Long sellerId,
            @RequestParam(required = false) FulfillmentStatus status) {
    	
        return ResponseEntity.ok(
                sellerOrderService.getSellerOrders(sellerId, status));
    }


    @PutMapping("/{orderItemId}/status")
    public ResponseEntity<ApiResponse> updateStatus(
            @RequestParam Long sellerId,
            @PathVariable Long orderItemId,
            @RequestParam FulfillmentStatus status) {
        return ResponseEntity.ok(sellerOrderService.updateFulfillmentStatus(
                        sellerId, orderItemId, status));
    }
    
    @GetMapping("/summary")
    public ResponseEntity<SellerOrderSummaryDto> getSellerSummary(
            @RequestParam Long sellerId
    ) {
        return ResponseEntity.ok(
                sellerOrderService.getSellerOrderSummary(sellerId)
        );
    }

}
