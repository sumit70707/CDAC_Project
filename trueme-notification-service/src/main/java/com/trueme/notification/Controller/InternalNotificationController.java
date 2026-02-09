package com.trueme.notification.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.notification.dto.SendOtpEmailRequestDto;
import com.trueme.notification.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/internal/notifications")
@RequiredArgsConstructor
@Slf4j
public class InternalNotificationController {

    private final EmailService emailService;
//internal/notifications/email/otp
    @PostMapping("/email/otp")
    public ResponseEntity<Void> sendOtpEmail(
            @RequestBody SendOtpEmailRequestDto dto) {
    	
    	log.info("Sending OTP email to {}", dto.getEmail());

        emailService.sendOtpEmail(dto.getEmail(), dto.getOtp());
        return ResponseEntity.ok().build();
    }
}
