package com.trueme.productcatalogservice.dto;

import java.math.BigDecimal;

import com.trueme.productcatalogservice.entity.enums.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternalProductDto {

    private Long id;

    private String name;

    private String imageUrl;

    private BigDecimal price;

    private Integer qty;

    private ProductStatus productStatus;

    private Long sellerId;
}
