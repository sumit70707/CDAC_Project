package com.trueme.authservice.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.authservice.dto.DeleteUserRequestDto;
import com.trueme.authservice.dto.UpdateUserRequestDto;
import com.trueme.authservice.dto.UserResponseDto;
import com.trueme.authservice.entity.User;
import com.trueme.authservice.entity.enums.Role;
import com.trueme.authservice.errorcode.AuthErrorCode;
import com.trueme.authservice.exception.AuthException;
import com.trueme.authservice.repository.UserRepository;
import com.trueme.authservice.service.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
	
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;

	@Override
	public List<UserResponseDto> getAllCustomers() {

		return userRepository.findByRole(Role.CUSTOMER)
				.stream()
				.map(user -> modelMapper.map(user, UserResponseDto.class))
				.toList();
	}

	@Override
	public UserResponseDto updateCustomer(Long userId, UpdateUserRequestDto dto) {

	    User user = userRepository.findById(userId)
	            .orElseThrow(() ->
	                    new AuthException(AuthErrorCode.AUTH_404_USER_NOT_FOUND) );

	    if (user.getRole() != Role.CUSTOMER) {
	        throw new AuthException(AuthErrorCode.AUTH_403_OPERATION_NOT_ALLOWED);
	    }

	    user.setIsPremium(dto.getIsPremium());

	    return modelMapper.map(
	            userRepository.save(user),
	            UserResponseDto.class);
	}

	@Override
	public void deleteCustomer(Long userId,DeleteUserRequestDto dto) {
		
		  User user = userRepository.findById(userId)
		            .orElseThrow(() ->
		                    new AuthException(AuthErrorCode.AUTH_404_USER_NOT_FOUND) );

		    if (user.getRole() != Role.CUSTOMER) {
		        throw new AuthException(AuthErrorCode.AUTH_403_OPERATION_NOT_ALLOWED);
		    }

		    user.setStatus(dto.getStatus());
		    
		    userRepository.save(user);

	}

}
