package com.trueme.orderservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AddToCartRequestDto {

    @NotNull
    private Long productId;

    @Min(1)
    private Integer quantity;
}
