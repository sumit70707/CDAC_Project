package com.trueme.orderservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.orderservice.entity.Order;
import com.trueme.orderservice.entity.enums.PaymentStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {
	
	Optional<Order> findByOrderNumber(String orderNumber);

	Page<Order> findByUserId(Long userId, Pageable pageable);

    List<Order> findByPaymentStatus(PaymentStatus paymentStatus);

    List<Order> findByUserIdAndPaymentStatus(Long userId, PaymentStatus paymentStatus);

}
