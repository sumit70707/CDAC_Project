package com.trueme.orderservice.dto;

import java.math.BigDecimal;

import com.trueme.orderservice.entity.enums.FulfillmentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponseDto {

    private Long productId;
    private Long sellerId;
    private String productName;
    private String imageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private FulfillmentStatus fulfillmentStatus;
}
