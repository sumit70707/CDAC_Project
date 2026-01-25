package com.trueme.productcatalogservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "wishlists",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_wishlist_user_product",
            columnNames = {"user_id", "product_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Same service → FK allowed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "product_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_wishlist_product")
    )
    private Product product;

    // Comes from Auth Service → NO FK
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "added_at", updatable = false)
    private LocalDateTime addedAt;

    @PrePersist
    void onCreate() {
        addedAt = LocalDateTime.now();
    }
}
