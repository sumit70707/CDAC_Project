package com.trueme.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordSendOtpRequestDto {

    @NotBlank
    @Email
    private String email;
}	