package com.trueme.authservice.service;

import com.trueme.authservice.dto.AddressRequestDto;
import com.trueme.authservice.dto.AddressResponseDto;

public interface AddressService {

    AddressResponseDto addAddress(Long userId, AddressRequestDto dto);

    AddressResponseDto getMyAddress(Long userId);

    //AddressResponseDto getMyAddress(Long userId, AddressRequestDto dto);

    void deleteAddress(Long userId);

	AddressResponseDto updateAddress(Long userId, AddressRequestDto dto);
}
