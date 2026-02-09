package com.trueme.orderservice.entity;

import com.trueme.orderservice.entity.enums.FulfillmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "order_items",
    indexes = {
        @Index(name = "idx_orderitems_order", columnList = "order_id"),
        @Index(name = "idx_orderitems_seller", columnList = "seller_id"),
        @Index(name = "idx_orderitems_product", columnList = "product_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many order items belong to one order
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    // Product snapshot
    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    /**
     * unitPrice * quantity
     * Calculated once at order creation
     */
    @Column(name = "subtotal", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Enumerated(EnumType.STRING)
    @Column(name = "fulfillment_status", nullable = false, length = 20)
    @Builder.Default
    private FulfillmentStatus fulfillmentStatus = FulfillmentStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
    	if (this.fulfillmentStatus == null) {
            this.fulfillmentStatus = FulfillmentStatus.PENDING;
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
