package com.trueme.notification.service;

import java.math.BigDecimal;
import java.util.List;

import com.trueme.notification.dto.OrderItemEventDto;
import com.trueme.notification.dto.PaymentNotificationEventDto;
import com.trueme.notification.entity.enums.PaymentStatus;

public interface EmailService {
	
	 void sendOtpEmail(String email, String otp);
	 
	 void sendRegistrationSuccessEmail(String email, String firstName);
	 
	  void sendOrderCreatedEmail(
	            String email,
	            String userName,
	            String orderNumber,
	            List<OrderItemEventDto> items,
	            BigDecimal totalAmount,
	            PaymentStatus paymentStatus
	    );

	    void sendItemStatusUpdatedEmail(
	            String email,
	            String userName,
	            String orderNumber,
	            List<OrderItemEventDto> updatedItems,
	            PaymentStatus paymentStatus
	    );

	    void sendOrderCancelledEmail(
	            String email,
	            String userName,
	            String orderNumber,
	            List<OrderItemEventDto> items,
	            BigDecimal totalAmount
	    );
	    

	    void sendPaymentStatusEmail(PaymentNotificationEventDto event);

}
