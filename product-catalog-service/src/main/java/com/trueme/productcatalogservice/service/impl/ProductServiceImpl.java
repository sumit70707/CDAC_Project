package com.trueme.productcatalogservice.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.productcatalogservice.dto.ProductResponseDto;
import com.trueme.productcatalogservice.entity.Product;
import com.trueme.productcatalogservice.repository.ProductRepository;
import com.trueme.productcatalogservice.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
	
	private final ProductRepository repo;
	
	private final ModelMapper modelMapper;

	@Override
	public List<ProductResponseDto> getAllProducts() {

		return repo.findAll()
	            .stream()
	            .map(product ->
	                    modelMapper.map(product, ProductResponseDto.class)
	            )
	            .collect(Collectors.toList());
	}

	@Override
	public ProductResponseDto findById(Long id) {
		
		Optional<Product> product= repo.findById(id);
		ProductResponseDto dto= modelMapper.map(product, ProductResponseDto.class);
		
		return dto;
	}

}
