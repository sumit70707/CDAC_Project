package com.trueme.orderservice.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.trueme.orderservice.entity.OrderItem;
import com.trueme.orderservice.entity.enums.FulfillmentStatus;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	
	List<OrderItem> findBySellerId(Long sellerId);

    List<OrderItem> findBySellerIdAndFulfillmentStatus(
            Long sellerId,
            FulfillmentStatus fulfillmentStatus);

    List<OrderItem> findByOrderId(Long orderId);
    
    @Query("""
    		SELECT oi FROM OrderItem oi
    		WHERE oi.sellerId = :sellerId
    		AND oi.order.paymentStatus = 'COMPLETED'
    		AND (:status IS NULL OR oi.fulfillmentStatus = :status)
    		""")
    		Page<OrderItem> findSellerOrders(
    		        @Param("sellerId") Long sellerId,
    		        @Param("status") FulfillmentStatus status,
    		        Pageable pageable
    		);
	

}
