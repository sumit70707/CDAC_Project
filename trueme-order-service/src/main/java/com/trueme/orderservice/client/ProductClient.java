package com.trueme.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.trueme.orderservice.dto.IncreaseStockRequest;
import com.trueme.orderservice.dto.ProductResponseDto;
import com.trueme.orderservice.dto.ReduceStockRequest;

@FeignClient(name = "trueme-product-catalog-service",
			url = "${trueme-product-catalog-service.url}")
public interface ProductClient {

    // fetch product for cart / checkout validation
    @GetMapping("/internal/products/{productId}")
    ProductResponseDto getProductById(
            @PathVariable("productId") Long productId
    );

    // reduce stock AFTER payment success
    @PostMapping("/internal/products/{productId}/reduce-stock")
    void reduceStock(
            @PathVariable("productId") Long productId,
            @RequestBody ReduceStockRequest request
    );
    
    @PostMapping("/internal/products/{productId}/increase-stock")
    void increaseStock(
            @PathVariable("productId") Long productId,
            @RequestBody IncreaseStockRequest request
    );
    
    
}
