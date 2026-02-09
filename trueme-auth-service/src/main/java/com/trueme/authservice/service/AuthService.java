package com.trueme.authservice.service;

import com.trueme.authservice.dto.AuthResponseDto;
import com.trueme.authservice.dto.ForgotPasswordRequestDto;
import com.trueme.authservice.dto.LoginRequestDto;
import com.trueme.authservice.dto.RegisterRequestDto;
import com.trueme.authservice.dto.VerifyEmailOtpRequestDto;

public interface AuthService {

    AuthResponseDto register(RegisterRequestDto request);

    AuthResponseDto login(LoginRequestDto request);
    
    //public List<UserResponseDto> getAllUsers();
    

	String sendEmailOtp(String email);

	String verifyEmailOtp( VerifyEmailOtpRequestDto dto);
	
	String sendForgotPasswordOtp(String email);
	
	String resetPassword(ForgotPasswordRequestDto dto);


}
