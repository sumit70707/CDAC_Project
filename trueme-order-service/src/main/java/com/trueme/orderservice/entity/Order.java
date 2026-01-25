package com.trueme.orderservice.entity;

import com.trueme.orderservice.entity.enums.OrderStatus;
import com.trueme.orderservice.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
    name = "orders",
    indexes = {
        @Index(name = "idx_orders_user", columnList = "user_id"),
        @Index(name = "idx_orders_payment_status", columnList = "payment_status"),
        @Index(name = "idx_orders_order_status", columnList = "order_status"),
        @Index(name = "idx_orders_payment_id", columnList = "payment_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 64)
    private String orderNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Optional reference only
    @Column(name = "shipping_address_id")
    private Long shippingAddressId;

    /**
     * Address snapshot stored as JSON string
     * Example: {"city":"Pune","pincode":"411001",...}
     */
    @Column(
        name = "shipping_address_snapshot",
        nullable = false,
        columnDefinition = "json"
    )
    private String shippingAddressSnapshot;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 20)
    @Builder.Default
    private OrderStatus orderStatus = OrderStatus.CREATED;

    @Column(name = "payment_id")
    private Long paymentId;

    @OneToMany(
        mappedBy = "order",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        if (this.currency == null) {
            this.currency = "INR";
        }

        if (this.paymentStatus == null) {
            this.paymentStatus = PaymentStatus.PENDING;
        }

        if (this.orderStatus == null) {
            this.orderStatus = OrderStatus.CREATED;
        }

        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }


    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
