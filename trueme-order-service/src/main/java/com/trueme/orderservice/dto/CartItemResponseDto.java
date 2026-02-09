package com.trueme.orderservice.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CartItemResponseDto {

    private Long productId;
    private Long sellerId;
    private String productName;
    private String productImage;
    private BigDecimal priceSnapshot;
    private Integer quantity;
}
