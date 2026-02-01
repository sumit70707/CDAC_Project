package com.trueme.notification.Factory;

import java.util.List;

import org.springframework.stereotype.Component;

import com.trueme.notification.entity.Notification;
import com.trueme.notification.service.NotificationSender;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationSenderFactory {

    private final List<NotificationSender> senders;

    public NotificationSender getSender(Notification notification) {
        return senders.stream()
                .filter(sender -> sender.supports(notification))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "No sender found for channel: " +
                                notification.getChannel()
                        ));
    }
}
