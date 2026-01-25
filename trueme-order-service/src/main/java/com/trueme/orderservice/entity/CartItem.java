package com.trueme.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "cart_items",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_cart_product",
            columnNames = {"cart_id", "product_id"}
        )
    },
    indexes = {
        @Index(name = "idx_cartitems_cart", columnList = "cart_id"),
        @Index(name = "idx_cartitems_product", columnList = "product_id"),
        @Index(name = "idx_cartitems_seller", columnList = "seller_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    // Product snapshot (UI only)
    @Column(name = "product_name", length = 255)
    private String productName;

    @Column(name = "product_image", length = 1000)
    private String productImage;

    @Column(name = "price_snapshot", nullable = false, precision = 12, scale = 2)
    private BigDecimal priceSnapshot;

    @Column(name = "quantity", nullable = false)
    @Builder.Default
    private Integer quantity=1;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.quantity == null) {
            this.quantity = 1;
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
