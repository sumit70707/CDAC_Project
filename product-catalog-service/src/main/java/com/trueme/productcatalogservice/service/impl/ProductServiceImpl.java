package com.trueme.productcatalogservice.service.impl;

import java.math.BigDecimal;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.productcatalogservice.dto.ProductRequestDto;
import com.trueme.productcatalogservice.dto.ProductResponseDto;
import com.trueme.productcatalogservice.entity.Product;
import com.trueme.productcatalogservice.entity.enums.ProductStatus;
import com.trueme.productcatalogservice.entity.enums.ProductType;
import com.trueme.productcatalogservice.entity.enums.SkinType;
import com.trueme.productcatalogservice.exception.product.ProductAlreadyExistsException;
import com.trueme.productcatalogservice.exception.product.ProductNotFoundException;
import com.trueme.productcatalogservice.exception.product.ProductOutOfStockException;
import com.trueme.productcatalogservice.repository.ProductRepository;
import com.trueme.productcatalogservice.repository.specification.ProductSpecification;
import com.trueme.productcatalogservice.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

	private final ProductRepository repo;

	private final ModelMapper modelMapper;

	@Value("${product.default.seller-id}")
	private Long defaultSellerId;

	@Override
	public Page<ProductResponseDto> getAllProducts(
			int page,
			int size,
			String sortBy, 
			String direction) {

		Sort sort = direction.equalsIgnoreCase("asc")
				? Sort.by(sortBy).ascending()
						: Sort.by(sortBy).descending();

		Pageable pageable = PageRequest.of(page, size, sort);

		return repo.findAllByIsActiveTrue(pageable)
				.map(product ->
				modelMapper.map(product, ProductResponseDto.class));
	}


	@Override
	public ProductResponseDto createProduct(ProductRequestDto requestDto) {

		if (repo.existsByNameAndPriceAndProductPhValueAndMlAndProductTypeAndSkinType(
				requestDto.getName(), requestDto.getPrice(), requestDto.getProductPhValue(),
				requestDto.getMl(), requestDto.getProductType(), requestDto.getSkinType())) {
			
			log.warn("Duplicate product found with name: {}",requestDto.getName());
			
			throw new ProductAlreadyExistsException(requestDto.getName());
		}

		Product product = modelMapper.map(requestDto, Product.class);

		if (product.getProductStatus() == null) {
			product.setProductStatus(ProductStatus.AVAILABLE);
		}

		product.setSellerId(defaultSellerId);

		product.setIsActive(true);

		Product savedProduct = repo.save(product);
		
		log.info("Product created successfully with id={}", savedProduct.getId());

		return modelMapper.map(savedProduct, ProductResponseDto.class);

	}

	@Override
	public ProductResponseDto getProductById(Long id) {

		Product product= repo.findByIdAndIsActiveTrue(id)
				.orElseThrow(() -> new ProductNotFoundException(id));

		return modelMapper.map(product, ProductResponseDto.class);
	}

	@Override
	public ProductResponseDto findProductByName(String name) {

		Product product =repo.findByNameAndIsActiveTrue(name)
				.orElseThrow(() -> new ProductNotFoundException(name));

		return modelMapper.map(product, ProductResponseDto.class);
	}

	@Override
	public Page<ProductResponseDto> findByIsActive(
			Boolean isActive,
			int page,
			int size,
			String sortBy, 
			String direction) {

		Sort sort = direction.equalsIgnoreCase("asc")
				? Sort.by(sortBy).ascending()
						: Sort.by(sortBy).descending();

		Pageable pageable = PageRequest.of(page, size,sort);

		return repo.findByIsActive(isActive, pageable)
				.map(product ->
				modelMapper.map(product, ProductResponseDto.class));
	}


	@Override
	public ProductResponseDto updateProduct(Long id, ProductRequestDto requestDto) {

		Product product = repo.findByIdAndIsActiveTrue(id)
				.orElseThrow(() -> new ProductNotFoundException(id));

		log.info("ProductRequestDto for update: {}",requestDto.toString());

		modelMapper.map(requestDto, product);

		Product updatedProduct = repo.save(product);
		
		log.info("Product updated successfully with id: {}",updatedProduct.getId());

		return modelMapper.map(updatedProduct, ProductResponseDto.class);
	}

	@Override
	public void deleteProduct(Long id) {

		Product product = repo.findByIdAndIsActiveTrue(id)
				.orElseThrow(() -> new ProductNotFoundException(id));

		product.setIsActive(false);
		
		repo.save(product);
		
		log.info("Deleted product successfully with id: {} :",product.getId());

	}

	@Override
	public void activateProduct(Long id) {

		Product product = repo.findById(id)
				.orElseThrow(() -> new ProductNotFoundException(id));

		product.setIsActive(true);
		
		repo.save(product);
		
		log.info("Product activated successfully with id: {}",product.getId());
	}

	public void decreaseStock(Long id, Integer qty) {

		Product product = repo.findByIdAndIsActiveTrue(id)
				.orElseThrow(() -> new ProductNotFoundException(id));

		if (product.getQty() < qty) {
			throw new ProductOutOfStockException(id);
		}

		product.setQty(product.getQty() - qty);

		if (product.getQty() == 0) {
			product.setProductStatus(ProductStatus.OUT_OF_STOCK);
		}

		repo.save(product);

		log.info("Stock decreased | productId={} | qty={}", id, qty);
	}

	public void increaseStock(Long id, Integer qty) {

		Product product = repo.findByIdAndIsActiveTrue(id)
				.orElseThrow(() -> new ProductNotFoundException(id));

		product.setQty(product.getQty() + qty);

		if (product.getQty() > 0) {
			product.setProductStatus(ProductStatus.AVAILABLE);
		}

		repo.save(product);

		log.info("Stock increased | productId={} | qty={}", id, qty);
	}



	@Override
	public Page<ProductResponseDto> filterProducts(
			ProductStatus status,
			SkinType skinType,
			ProductType productType,
			BigDecimal minPrice,
			BigDecimal maxPrice,
			BigDecimal minPh,
			BigDecimal maxPh,
			int page,
			int size,String sortBy,
			String direction) {

		Specification<Product> spec =
				ProductSpecification.isActive()   // only Active
				.and(ProductSpecification.hasProductStatus(status))
				.and(ProductSpecification.hasSkinType(skinType))
				.and(ProductSpecification.hasProductType(productType))
				.and(ProductSpecification.priceBetween(minPrice, maxPrice))
				.and(ProductSpecification.phValueBetween(minPh, maxPh));

		Sort sort = direction.equalsIgnoreCase("asc")
				? Sort.by(sortBy).ascending()
						: Sort.by(sortBy).descending();
		
		Pageable pageable = PageRequest.of(page, size,sort);

		return repo.findAll(spec, pageable)
				.map(product ->
				modelMapper.map(product, ProductResponseDto.class));
	}


}
