package com.trueme.notification.dto;

import java.math.BigDecimal;
import java.util.List;

import com.trueme.notification.entity.enums.OrderEventType;
import com.trueme.notification.entity.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEventDto {

    //  Event metadata
    private OrderEventType eventType;

    //  Order info shown to user
    private String orderNumber; // UUID

    //  User info
    private String userName;
    private String userEmail;

    //  Payment info
    private PaymentStatus paymentStatus;

    //  Items involved in this event
    private List<OrderItemEventDto> items;

    //  Order total
    private BigDecimal totalAmount;
}
