package com.trueme.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ForgotPasswordRequestDto {
	
	@NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 320)
    private String email;
	
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 64, message = "Password must be 8–64 characters")
    private String newPassword;
}
