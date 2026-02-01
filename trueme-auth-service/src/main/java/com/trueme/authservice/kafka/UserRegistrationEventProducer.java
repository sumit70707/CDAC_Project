package com.trueme.authservice.kafka;


import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trueme.authservice.dto.UserRegisteredEventDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRegistrationEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String TOPIC = "user-registration-events";

    public void publishUserRegisteredEvent(UserRegisteredEventDto event) {

        try {
        	//java obj -> Json string
            String message = objectMapper.writeValueAsString(event);
            
            log.info("Message-------------------------",message);

            kafkaTemplate.send(TOPIC, message);

            log.info("Published UserRegisteredEvent to Kafka: {}", event);

        } catch (Exception ex) {
            log.error("Failed to publish UserRegisteredEvent", ex);
            // do NOT fail registration
        }
    }
}