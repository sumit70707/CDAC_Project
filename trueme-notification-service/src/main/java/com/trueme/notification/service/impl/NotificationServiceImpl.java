package com.trueme.notification.service.impl;


import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.notification.entity.Notification;
import com.trueme.notification.entity.enums.NotificationErrorCode;
import com.trueme.notification.entity.enums.NotificationStatus;
import com.trueme.notification.repository.NotificationRepository;
import com.trueme.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public Notification createNotification(Notification notification) {
        log.info("Creating notification for userId={}, eventType={}",
                notification.getUserId(),
                notification.getEventType());

        return notificationRepository.save(notification);
    }

    @Override
    public void markAsSent(Long notificationId) {
        Notification notification = getNotification(notificationId);

        notification.setStatus(NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());

        notificationRepository.save(notification);

        log.info("Notification {} marked as SENT", notificationId);
    }

    @Override
    public void markAsFailed(Long notificationId,
                             NotificationErrorCode errorCode) {

        Notification notification = getNotification(notificationId);

        notification.setStatus(NotificationStatus.FAILED);
        notification.setLastErrorCode(errorCode);

        notificationRepository.save(notification);

        log.warn("Notification {} marked as FAILED with errorCode={}",
                notificationId, errorCode);
    }

    @Override
    public void incrementRetry(Long notificationId) {
        Notification notification = getNotification(notificationId);

        notification.setRetryCount(notification.getRetryCount() + 1);

        notificationRepository.save(notification);

        log.info("Retry incremented for notification {}, retryCount={}",
                notificationId, notification.getRetryCount());
    }

    private Notification getNotification(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Notification not found with id: " + id
                        ));
    }
}