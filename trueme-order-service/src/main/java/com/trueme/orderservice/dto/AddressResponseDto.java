package com.trueme.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AddressResponseDto {

    private Long id;
    private String addressLine1;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
