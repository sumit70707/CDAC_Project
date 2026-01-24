package com.trueme.authservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponseDto {

    private Long id;
    private String addressLine1;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
