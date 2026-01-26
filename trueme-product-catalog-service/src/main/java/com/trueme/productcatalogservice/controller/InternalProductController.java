package com.trueme.productcatalogservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.productcatalogservice.dto.InternalProductDto;
import com.trueme.productcatalogservice.dto.StockUpdateRequest;
import com.trueme.productcatalogservice.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/internal/products")
@RequiredArgsConstructor
public class InternalProductController {

    private final ProductService productService;

    @GetMapping("/{productId}")
    public InternalProductDto getProductForOrder(
            @PathVariable Long productId) {

        return productService.getInternalProduct(productId);
    }
    
    @PostMapping("/{productId}/reduce-stock")
    public ResponseEntity<Void> reduceStock(
            @PathVariable Long productId,
            @RequestBody StockUpdateRequest request) {

        productService.decreaseStock(productId, request.getQuantity());
        return ResponseEntity.ok().build();
    }
}