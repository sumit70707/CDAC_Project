package com.trueme.orderservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
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
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponseWithData<List<OrderResponseDto>>> getMyOrders(
            @RequestParam Long userId) {
    	
        return ResponseEntity.ok(orderService.getMyOrders(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrderDetails(
            @RequestParam Long userId,
            @PathVariable Long orderId) {
    	
        return ResponseEntity.ok(orderService.getOrderById(userId, orderId));
    }
}

