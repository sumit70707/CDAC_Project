package com.trueme.authservice.service;

import com.trueme.authservice.dto.AuthResponseDto;
import com.trueme.authservice.dto.LoginRequestDto;
import com.trueme.authservice.dto.RegisterRequestDto;

public interface AuthService {

    AuthResponseDto register(RegisterRequestDto request);

    AuthResponseDto login(LoginRequestDto request);
}
