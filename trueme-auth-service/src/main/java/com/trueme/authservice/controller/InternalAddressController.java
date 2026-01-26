package com.trueme.authservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.authservice.dto.AddressResponseDto;
import com.trueme.authservice.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalAddressController {
	
	private final AddressService addressService;
	
	@GetMapping("/users/{userId}/address")
	public AddressResponseDto getDefaultAddress(
	        @PathVariable Long userId) {
		
	    return addressService.getMyAddress(userId);
	}

	
	

}
