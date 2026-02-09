package com.trueme.orderservice.dto;

import java.math.BigDecimal;

import com.trueme.orderservice.entity.enums.FulfillmentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemEventDto {


    private String productName;

    private Integer quantity;

    private BigDecimal price;

    private FulfillmentStatus fulfillmentStatus;
}