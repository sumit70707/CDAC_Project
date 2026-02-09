package com.trueme.orderservice.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UpdateCartItemRequestDto {

    @Min(1)
    private Integer quantity;
}
