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
public class SellerOrderItemResponseDto {

    private Long orderItemId;
    private Long orderId;
    private String orderNumber;

    private Long productId;
    private String productName;

    private Integer quantity;
    private BigDecimal subtotal;

    private FulfillmentStatus fulfillmentStatus;
}
