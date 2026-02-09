package com.trueme.orderservice.dto;

import com.trueme.orderservice.entity.enums.CartStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponseDto {

    private Long id;
    private Long userId;
    private CartStatus status;
    private List<CartItemResponseDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
