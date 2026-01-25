package com.trueme.orderservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.orderservice.entity.OrderItem;
import com.trueme.orderservice.entity.enums.FulfillmentStatus;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	
	List<OrderItem> findBySellerId(Long sellerId);

    List<OrderItem> findBySellerIdAndFulfillmentStatus(
            Long sellerId,
            FulfillmentStatus fulfillmentStatus);

    List<OrderItem> findByOrderId(Long orderId);

}
