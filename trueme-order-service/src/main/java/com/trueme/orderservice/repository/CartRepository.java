package com.trueme.orderservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.trueme.orderservice.entity.Cart;

import jakarta.persistence.LockModeType;

public interface CartRepository extends JpaRepository<Cart, Long> {
	
	Optional<Cart> findByUserIdAndActiveTrue(Long userId);
	
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c FROM Cart c WHERE c.userId = :userId AND c.active = true")
	Optional<Cart> findByUserIdAndActiveTrueForUpdate(@Param("userId") Long userId);



}
