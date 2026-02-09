package com.trueme.authservice.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.authservice.dto.UpdateProfileRequestDto;
import com.trueme.authservice.dto.UserResponseDto;
import com.trueme.authservice.entity.User;
import com.trueme.authservice.errorcode.AuthErrorCode;
import com.trueme.authservice.exception.AuthException;
import com.trueme.authservice.repository.UserRepository;
import com.trueme.authservice.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public UserResponseDto getMyProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.AUTH_404_USER_NOT_FOUND));

        return modelMapper.map(user, UserResponseDto.class);
    }

    @Override
    public UserResponseDto updateMyProfile(
            Long userId,
            UpdateProfileRequestDto dto) {
    	
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.AUTH_404_USER_NOT_FOUND));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());

        return modelMapper.map(
                userRepository.save(user),UserResponseDto.class);
    }
}

