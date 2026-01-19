package com.trueme.productcatalogservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.trueme.productcatalogservice.entity.enums.ProductStatus;
import com.trueme.productcatalogservice.entity.enums.ProductType;
import com.trueme.productcatalogservice.entity.enums.SkinType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductRequestDTO {

	private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private Integer qty;

    private ProductStatus productStatus;
    private SkinType skinType;
    private ProductType productType;

    private BigDecimal productPhValue;
    private Long sellerId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
