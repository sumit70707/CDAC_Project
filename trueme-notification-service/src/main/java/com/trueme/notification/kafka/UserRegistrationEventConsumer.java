package com.trueme.notification.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trueme.notification.dto.UserRegisteredEventDto;
import com.trueme.notification.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRegistrationEventConsumer {

    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(
            topics = "user-registration-events",
            groupId = "trueme-notification-group"
    )
    public void consumeUserRegisteredEvent(String message) {

        try {
            // 1️ Convert JSONString → javaObject
            UserRegisteredEventDto event =
                    objectMapper.readValue(message, UserRegisteredEventDto.class);

            log.info("Received UserRegisteredEvent: {}", event);

            // 2️ Send registration success email
            emailService.sendRegistrationSuccessEmail(
                    event.getEmail(),
                    event.getFirstName()
            );

        } catch (Exception ex) {
            log.error("Failed to process UserRegisteredEvent", ex);
            // later → retry / dead-letter topic
        }
    }
}