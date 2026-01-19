package com.trueme.productcatalogservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.productcatalogservice.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findAll();
	
	Optional<Product> findById(Long id);

}
