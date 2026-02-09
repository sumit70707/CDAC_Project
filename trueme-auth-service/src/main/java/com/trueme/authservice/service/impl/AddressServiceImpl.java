package com.trueme.authservice.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.authservice.dto.AddressRequestDto;
import com.trueme.authservice.dto.AddressResponseDto;
import com.trueme.authservice.entity.Address;
import com.trueme.authservice.entity.User;
import com.trueme.authservice.errorcode.AuthErrorCode;
import com.trueme.authservice.exception.AuthException;
import com.trueme.authservice.repository.AddressRepository;
import com.trueme.authservice.repository.UserRepository;
import com.trueme.authservice.service.AddressService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AddressServiceImpl implements AddressService {

	private final AddressRepository addressRepository;
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;

	@Override
	public AddressResponseDto addAddress(Long userId, AddressRequestDto dto) {

		if (addressRepository.existsByUserId(userId)) {
			throw new AuthException(AuthErrorCode.AUTH_409_ADDRESS_ALREADY_EXISTS);
		}

		User user = userRepository.findById(userId)
				.orElseThrow(() ->
				new AuthException(AuthErrorCode.AUTH_401_INVALID_CREDENTIALS));

		log.info("Address Request AddressResponseDto: {}",dto);

		Address address = modelMapper.map(dto, Address.class);
		address.setUser(user);

		Address saved = addressRepository.save(address);

		return modelMapper.map(saved, AddressResponseDto.class);
	}

	@Override
	public AddressResponseDto getMyAddress(Long userId) {

		Address address = addressRepository.findByUserId(userId)
				.orElseThrow(() ->
				new AuthException(AuthErrorCode.AUTH_404_ADDRESS_NOT_FOUND));

		AddressResponseDto responseDto=modelMapper.map(address, AddressResponseDto.class);

		log.info("Address Response for userId: {} AddressResponseDto: {}",userId,responseDto);

		return responseDto;
	}

	@Override
	public AddressResponseDto updateAddress(Long userId, AddressRequestDto dto) {

		Address address = addressRepository.findByUserId(userId)
				.orElseThrow(() ->
				new AuthException(AuthErrorCode.AUTH_404_ADDRESS_NOT_FOUND));

		log.info("Address Update Request AddressRequestDto: {}",dto);

		modelMapper.map(dto, address);

		Address updated = addressRepository.save(address);

		return modelMapper.map(updated, AddressResponseDto.class);
	}

	@Override
	public void deleteAddress(Long userId) {

		if (!addressRepository.existsByUserId(userId)) {
			throw new AuthException(AuthErrorCode.AUTH_404_ADDRESS_NOT_FOUND);
		}
		
		addressRepository.deleteByUserId(userId);
		
		log.info("Address is deleted for userId: {}",userId);
	}

}
