package com.trueme.notification.service.impl;


import org.springframework.stereotype.Component;

import com.trueme.notification.entity.Notification;
import com.trueme.notification.entity.enums.NotificationChannel;
import com.trueme.notification.service.NotificationSender;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class EmailNotificationSender implements NotificationSender {

    @Override
    public boolean supports(Notification notification) {
        return notification.getChannel() == NotificationChannel.EMAIL;
    }

    @Override
    public void send(Notification notification) {
        log.info(
            "Sending EMAIL notification to userId={}, template={}",
            notification.getUserId(),
            notification.getTemplateName()
        );

        // Actual email sending will come later
        // For now, assume success or throw exception

        // throw new RuntimeException("SMTP timeout"); // example
    }
}