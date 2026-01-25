package com.trueme.authservice.service;

import java.util.List;

import com.trueme.authservice.dto.DeleteUserRequestDto;
import com.trueme.authservice.dto.UpdateUserRequestDto;
import com.trueme.authservice.dto.UserResponseDto;

public interface AdminService {


	List<UserResponseDto> getAllCustomers();

	UserResponseDto updateCustomer(Long userId, UpdateUserRequestDto dto);

	void deleteCustomer(Long userId,DeleteUserRequestDto dto);

}
