package com.trueme.orderservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.service.CheckoutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {
	
	private final CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<ApiResponse> checkout(
            @RequestParam Long userId) {
    	
        return ResponseEntity.ok(checkoutService.checkout(userId));
    }

}
