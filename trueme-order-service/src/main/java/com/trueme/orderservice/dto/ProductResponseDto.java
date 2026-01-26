package com.trueme.orderservice.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProductResponseDto {

    private Long id;
    private String name;
    private String imageUrl;
    private BigDecimal price;
    private Integer qty;               // stock
    private String productStatus;       // AVAILABLE / OUT_OF_STOCK / INACTIVE
    private Long sellerId;
}

