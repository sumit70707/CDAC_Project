package com.trueme.orderservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.service.CheckoutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CheckoutController {
	
	private final CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<ApiResponse> checkout(
    		 @AuthenticationPrincipal Jwt jwt) {
    	
    	Long userId = jwt.getClaim("userId");
    	
        return ResponseEntity.ok(checkoutService.checkout(userId));
    }

}
