package com.trueme.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.notification.entity.Notification;
import com.trueme.notification.entity.enums.NotificationStatus;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	
	 // Fetch pending notifications for processing
    List<Notification> findByStatus(NotificationStatus status);

    // Fetch failed notifications eligible for retry
    List<Notification> findByStatusAndRetryCountLessThan(
            NotificationStatus status,
            int maxRetryCount);

}
