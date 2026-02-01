package com.trueme.authservice.controller;

import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.authservice.dto.AddressResponseDto;
import com.trueme.authservice.dto.UserDetailsDto;
import com.trueme.authservice.entity.User;
import com.trueme.authservice.errorcode.AuthErrorCode;
import com.trueme.authservice.exception.AuthException;
import com.trueme.authservice.repository.UserRepository;
import com.trueme.authservice.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalUserDetailsController {

	private final AddressService addressService;
	private final UserRepository userRepository;

	@GetMapping("/users/{userId}/address")
	public AddressResponseDto getDefaultAddress(
			@PathVariable Long userId) {

		return addressService.getMyAddress(userId);
	}

	@GetMapping("/users/{userId}")
	UserDetailsDto getUserDetails(@PathVariable("userId") Long userId) {

		User user=userRepository.findById(userId)
				.orElseThrow(() -> new AuthException(AuthErrorCode.AUTH_404_USER_NOT_FOUND));

		UserDetailsDto UserDetailsDto = new UserDetailsDto(
				user.getId(),
				user.getFirstName(),
				user.getEmail());

		return UserDetailsDto;
	}




}
