package com.trueme.authservice.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.authservice.dto.AuthResponseDto;
import com.trueme.authservice.dto.ForgotPasswordRequestDto;
import com.trueme.authservice.dto.LoginRequestDto;
import com.trueme.authservice.dto.RegisterRequestDto;
import com.trueme.authservice.dto.UserResponseDto;
import com.trueme.authservice.entity.User;
import com.trueme.authservice.entity.enums.Status;
import com.trueme.authservice.errorcode.AuthErrorCode;
import com.trueme.authservice.exception.AuthException;
import com.trueme.authservice.repository.UserRepository;
import com.trueme.authservice.security.JwtUtil;
import com.trueme.authservice.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

//TODO DeleteUser GetallUSers UpdateUser Logout

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ModelMapper modelMapper;

    @Override
    public AuthResponseDto register(RegisterRequestDto requestDto) {

        if (userRepository.findByEmail(requestDto.getEmail()).isPresent()) {
        	throw new AuthException(AuthErrorCode.AUTH_409_EMAIL_EXISTS);
        }
        
        log.info("User Registration Request with RegisterRequestDto: {}",requestDto);
        //TODO
        /*
        1. User enters email
		2. Auth Service → Email Service (sync) → send OTP
		3. User submits OTP
		4. Auth Service verifies OTP
		5. ONLY NOW → create user in DB
		6. Generate JWT
		7. Login user
         */
        User user = modelMapper.map(requestDto, User.class);

        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser);

        UserResponseDto userResponseDto=modelMapper.map(savedUser, UserResponseDto.class);
        
        log.info("User registered successfully with userId: {}",userResponseDto.getId());
        
        return AuthResponseDto.builder()
                .accessToken(token)
                .user(userResponseDto)
                .build();
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException(AuthErrorCode.AUTH_401_INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        	throw new AuthException(AuthErrorCode.AUTH_401_INVALID_CREDENTIALS);
        }
        
        if (user.getStatus() != Status.ACTIVE) {
            throw new AuthException(AuthErrorCode.AUTH_403_ACCOUNT_DISABLED);
        }

        log.info("Login request come for Email: {}",request.getEmail());
        
        user.setLastLogin(LocalDateTime.now());

        String token = jwtUtil.generateToken(user);
        
        UserResponseDto userResponseDto=modelMapper.map(user, UserResponseDto.class);
        
        log.info("Login successfull for User: {}",userResponseDto);

        return AuthResponseDto.builder()
                .accessToken(token)
                .user(userResponseDto)
                .build();
    }

//	@Override
//	public List<UserResponseDto> getAllUsers() {
//		
//		return userRepository.findAll()
//	            .stream()
//	            .map(user -> modelMapper.map(user, UserResponseDto.class))
//	            .toList();
//	}

	@Override
	public String forgotPassword(ForgotPasswordRequestDto dto) {
		
		User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() ->
                        new AuthException(AuthErrorCode.AUTH_404_USER_NOT_FOUND));

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        userRepository.save(user);
        
        log.info("Password changed for User: {}",dto);
        
        return "Password changed successfully for user: " + dto.getEmail();
		
	}

}
