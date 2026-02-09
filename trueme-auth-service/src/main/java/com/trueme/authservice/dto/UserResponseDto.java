package com.trueme.authservice.dto;

import com.trueme.authservice.entity.enums.Role;
import com.trueme.authservice.entity.enums.Status;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserResponseDto {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;

    private Role role;
    private Status status;
    private Boolean isPremium;
}
