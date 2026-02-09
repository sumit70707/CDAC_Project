package com.trueme.productcatalogservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.productcatalogservice.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

	List<Wishlist> findByUserId(Long userId);
	
	boolean existsByUserIdAndProduct_Id(Long userId, Long productId);

    Optional<Wishlist> findByUserIdAndProduct_Id(Long userId, Long productId);

    //void deleteByIdAndUserIdAnd(Long id, Long userId);

}
