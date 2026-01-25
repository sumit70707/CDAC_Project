package com.trueme.productcatalogservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class WishlistRequestDto {

    @NotNull
    private Long id;
}
