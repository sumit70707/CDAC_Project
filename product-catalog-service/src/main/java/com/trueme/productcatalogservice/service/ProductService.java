package com.trueme.productcatalogservice.service;

import java.util.List;

import com.trueme.productcatalogservice.dto.ProductResponseDto;

public interface ProductService {
	
	List<ProductResponseDto> getAllProducts();
	
	ProductResponseDto findById(Long id);

}
