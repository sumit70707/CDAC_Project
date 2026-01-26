package com.trueme.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.trueme.orderservice.dto.AddressResponseDto;

@FeignClient(
        name = "trueme-auth-service",
        url = "${trueme-auth-service.url}"
)
public interface AddressClient {

    @GetMapping("/internal/users/{userId}/address")
    AddressResponseDto getDefaultAddress(
            @PathVariable("userId") Long userId
    );
}
