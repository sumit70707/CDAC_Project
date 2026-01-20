package com.trueme.productcatalogservice.service;

import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import com.trueme.productcatalogservice.dto.ProductRequestDto;
import com.trueme.productcatalogservice.dto.ProductResponseDto;
import com.trueme.productcatalogservice.entity.enums.ProductStatus;
import com.trueme.productcatalogservice.entity.enums.ProductType;
import com.trueme.productcatalogservice.entity.enums.SkinType;

public interface ProductService {

	ProductResponseDto createProduct(ProductRequestDto requestDto);

	Page<ProductResponseDto> getAllProducts(int page, int size, 
			String sortBy, String direction);

	ProductResponseDto getProductById(Long id);

	ProductResponseDto findProductByName(String name);

	Page<ProductResponseDto> findByIsActive(Boolean isActive, int page,
			int size, String sortBy, String direction);

	ProductResponseDto updateProduct(Long id, ProductRequestDto requestDto);

	void deleteProduct(Long id);

	void activateProduct(Long id);

	Page<ProductResponseDto> filterProducts( ProductStatus status,
			SkinType skinType,
			ProductType productType,
			BigDecimal minPrice,
			BigDecimal maxPrice,
			BigDecimal minPh,
			BigDecimal maxPh,
			int page,
			int size,
			String sortBy,
			String direction);

	void decreaseStock(Long id, Integer quantity);

	void increaseStock(Long id, Integer quantity);




}
