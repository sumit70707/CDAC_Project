package com.trueme.productcatalogservice.controller;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.productcatalogservice.dto.ProductRequestDto;
import com.trueme.productcatalogservice.dto.ProductResponseDto;
import com.trueme.productcatalogservice.dto.StockUpdateRequest;
import com.trueme.productcatalogservice.entity.enums.ProductStatus;
import com.trueme.productcatalogservice.entity.enums.ProductType;
import com.trueme.productcatalogservice.entity.enums.SkinType;
import com.trueme.productcatalogservice.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

	@GetMapping
	public ResponseEntity<Page<ProductResponseDto>> getAllProducts(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "2") int size,
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String direction) {

		return ResponseEntity.ok(
				productService.getAllProducts(page, size,sortBy, direction)
				);
	}


	@PostMapping
	public ResponseEntity<ProductResponseDto> createProduct(
			@Valid @RequestBody ProductRequestDto request) {

		ProductResponseDto response = productService.createProduct(request);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductResponseDto> getProductById(
			@PathVariable Long id) {

		return ResponseEntity.ok(productService.getProductById(id));
	}

	@GetMapping("/name")
	public ResponseEntity<ProductResponseDto> findProductByName(
			 @RequestParam String name) {

		return ResponseEntity.ok(productService.findProductByName(name));
	}


	@GetMapping("/status")
	public ResponseEntity<Page<ProductResponseDto>> findByIsActive(
			@RequestParam Boolean isActive,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "2") int size,
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String direction
			) {

		return ResponseEntity.ok(
				productService.findByIsActive(isActive, page, size, sortBy, direction));
	}


	@PutMapping("/{id}")
	public ResponseEntity<ProductResponseDto> updateProduct(
			@PathVariable Long id,
			@Valid @RequestBody ProductRequestDto requestDto) {

		return ResponseEntity.ok(productService.updateProduct(id, requestDto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {

		productService.deleteProduct(id);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{id}/activate")
	public ResponseEntity<Void> activateProduct(@PathVariable Long id) {

		productService.activateProduct(id);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{id}/stock/decrease")
	public ResponseEntity<Void> decreaseStock(
			@PathVariable Long id,
			@RequestBody StockUpdateRequest request) {

		productService.decreaseStock(id, request.getQuantity());
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{id}/stock/increase")
	public ResponseEntity<Void> increaseStock(
			@PathVariable Long id,
			@RequestBody StockUpdateRequest request) {

		productService.increaseStock(id, request.getQuantity());
		return ResponseEntity.ok().build();
	}

	@GetMapping("/filter")
	public ResponseEntity<Page<ProductResponseDto>> filterProducts(
			@RequestParam(required = false) ProductStatus productStatus,
			@RequestParam(required = false) SkinType skinType,
			@RequestParam(required = false) ProductType productType,

			@RequestParam(required = false) BigDecimal minPrice,
			@RequestParam(required = false) BigDecimal maxPrice,

			@RequestParam(required = false) BigDecimal minPhValue,
			@RequestParam(required = false) BigDecimal maxPhValue,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size,
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String direction
			) {

		return ResponseEntity.ok(
				productService.filterProducts(
						productStatus,
						skinType,
						productType,
						minPrice,
						maxPrice,
						minPhValue,
						maxPhValue,
						page,
						size,
						sortBy,
						direction
						)
				);
	}

}
