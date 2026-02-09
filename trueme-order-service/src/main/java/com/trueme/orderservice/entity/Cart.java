package com.trueme.orderservice.entity;

import com.trueme.orderservice.entity.enums.CartStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
    name = "carts",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_cart_user", 
        		columnNames = {"user_id", "is_active"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private CartStatus status=CartStatus.ACTIVE;

    @OneToMany(
        mappedBy = "cart",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<CartItem> cartItems;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = CartStatus.ACTIVE;
        }
        if (this.active == null) {
            this.active = true;
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
