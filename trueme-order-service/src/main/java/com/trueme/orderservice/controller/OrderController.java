package com.trueme.orderservice.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.orderservice.dto.ApiResponseWithData;
import com.trueme.orderservice.dto.OrderResponseDto;
import com.trueme.orderservice.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponseWithData<Page<OrderResponseDto>>> getMyOrders(
    		@AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
    	
    	 Long userId = jwt.getClaim("userId");

        return ResponseEntity.ok(
                orderService.getMyOrders(userId, page, size));
    }


    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrderDetails(
    		 @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long orderId) {
    	
    	Long userId = jwt.getClaim("userId");
    	
        return ResponseEntity.ok(orderService.getOrderById(userId, orderId));
    }
}

