package com.trueme.notification.entity;

import java.time.LocalDateTime;

import com.trueme.notification.entity.enums.NotificationChannel;
import com.trueme.notification.entity.enums.NotificationErrorCode;
import com.trueme.notification.entity.enums.NotificationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notifications",
       indexes = {
           @Index(name = "idx_notifications_user", columnList = "user_id"),
           @Index(name = "idx_notifications_status", columnList = "status"),
           @Index(name = "idx_notifications_event", columnList = "event_type"),
           @Index(name = "idx_notifications_channel", columnList = "channel"),
           @Index(name = "idx_notifications_error_code", columnList = "last_error_code")
       })
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who will receive the notification
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Why this notification was triggered
    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    // Channel: EMAIL / WHATSAPP
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationChannel channel;

    // Template identifier
    @Column(name = "template_name", nullable = false, length = 100)
    private String templateName;

    // Dynamic data for template rendering
    @Column(columnDefinition = "json", nullable = false)
    private String payload;

    // Delivery status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private NotificationStatus status = NotificationStatus.PENDING;

    // Retry count
    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private int retryCount = 0;

    // Short failure reason (machine readable)
    @Enumerated(EnumType.STRING)
    @Column(name = "last_error_code", length = 50)
    private NotificationErrorCode lastErrorCode;

    // Timestamps
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @PrePersist
    protected void onCreate() {
    	if(status==null) {
    		this.status=NotificationStatus.PENDING;
    	}
        this.createdAt = LocalDateTime.now();
    }
}
