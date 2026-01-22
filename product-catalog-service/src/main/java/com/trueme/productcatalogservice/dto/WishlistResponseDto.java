package com.trueme.productcatalogservice.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class WishlistResponseDto {

    private Long id;
    private ProductResponseDto  product;
    private Long userId;
    private LocalDateTime addedAt;
    

}
