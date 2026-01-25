package com.trueme.authservice.service;

import com.trueme.authservice.dto.UpdateProfileRequestDto;
import com.trueme.authservice.dto.UserResponseDto;

public interface UserService {

    UserResponseDto getMyProfile(Long userId);

    UserResponseDto updateMyProfile(Long userId, UpdateProfileRequestDto dto);
}
