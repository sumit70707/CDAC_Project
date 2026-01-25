package com.trueme.productcatalogservice.repository;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.trueme.productcatalogservice.entity.Product;
import com.trueme.productcatalogservice.entity.enums.ProductType;
import com.trueme.productcatalogservice.entity.enums.SkinType;

public interface ProductRepository
        extends JpaRepository<Product, Long>,
                JpaSpecificationExecutor<Product> {
	
	Page<Product> findAllByIsActiveTrue(Pageable pageable);

    Optional<Product> findByIdAndIsActiveTrue(Long id);
    
    //List<Product> findByIsActiveTrue();
    
    Optional<Product> findByNameAndIsActiveTrue(String name);
    
    Page<Product> findByIsActive(Boolean isActive, Pageable pageable);
    
    boolean existsByName(String name);
    
    boolean existsByNameAndPriceAndProductPhValueAndMlAndProductTypeAndSkinType(
            String name,
            BigDecimal price,
            BigDecimal productPhValue,
            Integer ml,
            ProductType productType,
            SkinType skinType
    );


}

