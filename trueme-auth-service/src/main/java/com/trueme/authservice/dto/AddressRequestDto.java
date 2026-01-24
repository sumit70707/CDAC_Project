package com.trueme.authservice.dto;

import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class AddressRequestDto {

    @NotBlank(message="AddressLine is Required")
    @Size(max = 255)
    private String addressLine1;

    @NotBlank(message="City is Required")
    @Size(max = 100)
    private String city;

    @NotBlank(message="State is Required")
    @Size(max = 100)
    private String state;

    @NotBlank(message="Postal code is Required")
    @Size(max = 30)
    private String postalCode;

    @Size(max = 100)
    private String country ;
    
    @PrePersist
    void onCreate() {
        if (country == null || country.isBlank()) {
            country = "India";
        }
    }

}
