package com.trueme.notification.service;

import com.trueme.notification.entity.Notification;

public interface NotificationSender {
	
	 /**
     * @return true if this sender supports the given channel
     */
    boolean supports(Notification notification);

    /**
     * Sends the notification.
     * Throws exception if sending fails.
     */
    void send(Notification notification);

}
