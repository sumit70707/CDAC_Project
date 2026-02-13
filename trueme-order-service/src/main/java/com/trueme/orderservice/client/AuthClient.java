package com.trueme.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.trueme.orderservice.dto.AddressResponseDto;
import com.trueme.orderservice.dto.UserDetailsDto;

@FeignClient(
        name = "trueme-auth-service"
)
public interface AuthClient {

    @GetMapping("/internal/users/{userId}/address")
    AddressResponseDto getDefaultAddress(@PathVariable("userId") Long userId);
    
    @GetMapping("/internal/users/{userId}")
    UserDetailsDto getUserDetails(@PathVariable("userId") Long userId);
    
}
