package com.trueme.orderservice.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
@PreAuthorize("hasRole('SELLER')")
public class SellerOrderController {

    private final SellerOrderService sellerOrderService;

    @GetMapping
    public ResponseEntity<Page<SellerOrderItemResponseDto>> getSellerOrders(
    		@AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) FulfillmentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
    	
    	Long sellerId = jwt.getClaim("userId");

        return ResponseEntity.ok(
                sellerOrderService.getSellerOrders(sellerId, status, page, size));
    }



    @PutMapping("/{orderItemId}/status")
    public ResponseEntity<ApiResponse> updateStatus(
    		 @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long orderItemId,
            @RequestParam FulfillmentStatus status) {
    	
    	Long sellerId = jwt.getClaim("userId");
    	
        return ResponseEntity.ok(sellerOrderService.updateFulfillmentStatus(
                        sellerId, orderItemId, status));
    }
    
    @GetMapping("/summary")
    public ResponseEntity<SellerOrderSummaryDto> getSellerSummary(
    		@AuthenticationPrincipal Jwt jwt) {
    	
    	Long sellerId = jwt.getClaim("userId");
    	
        return ResponseEntity.ok(
                sellerOrderService.getSellerOrderSummary(sellerId));
    }

}
