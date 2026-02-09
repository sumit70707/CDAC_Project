package com.trueme.notification.service;

import com.trueme.notification.entity.Notification;
import com.trueme.notification.entity.enums.NotificationErrorCode;

public interface NotificationService {
	
	// Create a new notification entry (called by Kafka consumer / sync API)
    Notification createNotification(Notification notification);

    // Mark notification as sent
    void markAsSent(Long notificationId);

    // Mark notification as failed
    void markAsFailed(
            Long notificationId,
            NotificationErrorCode errorCode
    );

    // Increment retry count
    void incrementRetry(Long notificationId);

}
