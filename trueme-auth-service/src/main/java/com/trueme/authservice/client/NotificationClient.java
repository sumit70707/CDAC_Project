package com.trueme.authservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.trueme.authservice.dto.SendOtpEmailRequestDto;

@FeignClient(
        name = "trueme-notification-service",
        url = "${trueme.notification.service.url}"
)
public interface NotificationClient {

    @PostMapping("/internal/notifications/email/otp")
    void sendOtpEmail(@RequestBody SendOtpEmailRequestDto requestDto);
}
