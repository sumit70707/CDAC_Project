package com.trueme.authservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.authservice.dto.AddressRequestDto;
import com.trueme.authservice.dto.AddressResponseDto;
import com.trueme.authservice.service.AddressService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/user/address")
@RequiredArgsConstructor
@Slf4j
public class AddressController {

    private final AddressService addressService;

    // TEMP until JWT wiring
    // TODO: Replace with userId from API Gateway==replaced

    @PostMapping
    public ResponseEntity<AddressResponseDto> addAddress(
    		@RequestHeader("X-USER-ID") Long userId,
            @Valid @RequestBody AddressRequestDto dto) {
    	log.info("Address Request comes: {}",dto);

        AddressResponseDto response =
                addressService.addAddress(userId, dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<AddressResponseDto> getMyAddress(@RequestHeader("X-USER-ID") Long userId) {

        AddressResponseDto response =
                addressService.getMyAddress(userId);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<AddressResponseDto> updateAddress(
    		@RequestHeader("X-USER-ID") Long userId,
            @Valid @RequestBody AddressRequestDto dto) {

        AddressResponseDto response =
                addressService.updateAddress(userId, dto);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAddress(@RequestHeader("X-USER-ID") Long userId) {

        addressService.deleteAddress(userId);

        return ResponseEntity.noContent().build(); 
    }
}
