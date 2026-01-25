package com.trueme.orderservice.service;

import com.trueme.orderservice.dto.ApiResponse;

public interface CheckoutService {
	
	ApiResponse checkout(Long userId);

}
