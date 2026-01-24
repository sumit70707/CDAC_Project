package com.trueme.authservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    // TODO: Replace with userId from API Gateway
    //private static final Long MOCK_USER_ID = 1L;

    @PostMapping("/{id}")
    public ResponseEntity<AddressResponseDto> addAddress(
    		@PathVariable Long id,
            @Valid @RequestBody AddressRequestDto dto) {
    	log.info("Address Request comes: {}",dto);

        AddressResponseDto response =
                addressService.addAddress(id, dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponseDto> getMyAddress(@PathVariable Long id) {

        AddressResponseDto response =
                addressService.getMyAddress(id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDto> updateAddress(
    		@PathVariable Long id,
            @Valid @RequestBody AddressRequestDto dto) {

        AddressResponseDto response =
                addressService.updateAddress(id, dto);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {

        addressService.deleteAddress(id);

        return ResponseEntity.noContent().build(); 
    }
}
