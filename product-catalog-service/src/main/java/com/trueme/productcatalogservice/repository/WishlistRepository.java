package com.trueme.productcatalogservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.productcatalogservice.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

	List<Wishlist> findByUserId(Long userId);
}
