package com.trueme.orderservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.orderservice.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
	
	Optional<Cart> findByUserIdAndActiveTrue(Long userId);


}
