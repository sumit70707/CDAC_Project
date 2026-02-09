package com.trueme.orderservice.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerOrderSummaryDto {

    private Long totalOrders;
    private Long deliveredOrders;
    private BigDecimal totalIncome;
}
