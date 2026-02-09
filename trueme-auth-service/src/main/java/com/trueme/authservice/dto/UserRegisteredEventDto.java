package com.trueme.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisteredEventDto {

    private Long userId;
    private String email;
    private String firstName;
}