package com.trueme.notification.service.impl;


import java.math.BigDecimal;
import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.trueme.notification.dto.OrderItemEventDto;
import com.trueme.notification.dto.PaymentNotificationEventDto;
import com.trueme.notification.entity.enums.PaymentStatus;
import com.trueme.notification.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Verify your email - TrueMe");
        message.setText(
                "Your OTP for email verification is: " + otp +
                "\n\nThis OTP is valid for 5 minutes." +
                "\nDo not share this OTP with anyone."
        );

        mailSender.send(message);

        log.info("OTP email sent successfully to {}", email);
    }
    
    @Override
    public void sendRegistrationSuccessEmail(String email, String firstName) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Welcome to Trueme 🎉");
        message.setText(
                "Hi " + firstName + ",\n\n" +
                "Your account has been successfully created.\n\n" +
                "Welcome to Trueme!\n\n" +
                "Regards,\nTrueme Team"
        );

        mailSender.send(message);

        log.info("Registration success email sent to {}", email);
    }
    
    @Override
    public void sendOrderCreatedEmail(
            String email,
            String userName,
            String orderNumber,
            List<OrderItemEventDto> items,
            BigDecimal totalAmount,
            PaymentStatus paymentStatus) {

        String subject = "✅ Order Confirmed | Order #" + orderNumber;

        StringBuilder body = new StringBuilder();
        body.append("Hi ").append(userName).append(",\n\n")
            .append("Thank you for your order! Your order has been successfully created.\n\n")
            .append("Order Number: ").append(orderNumber).append("\n")
            .append("Payment Status: ").append(paymentStatus).append("\n\n")
            .append("Order Items:\n")
            .append("---------------------------------\n");

        for (OrderItemEventDto item : items) {
            body.append("Product: ").append(item.getProductName()).append("\n")
                .append("Quantity: ").append(item.getQuantity()).append("\n")
                .append("Price: ₹").append(item.getPrice()).append("\n")
                .append("Status: ").append(item.getFulfillmentStatus()).append("\n")
                .append("---------------------------------\n");
        }

        body.append("Total Amount: ₹").append(totalAmount).append("\n\n")
            .append("We will notify you once your items are shipped.\n\n")
            .append("Regards,\n")
            .append("Trueme Team");

        sendEmail(email, subject, body.toString());
    }

    @Override
    public void sendItemStatusUpdatedEmail(
            String email,
            String userName,
            String orderNumber,
            List<OrderItemEventDto> updatedItems,
            PaymentStatus paymentStatus) {

        String subject = "🚚 Order Update | Order #" + orderNumber;

        StringBuilder body = new StringBuilder();
        body.append("Hi ").append(userName).append(",\n\n")
            .append("There is an update on your order.\n\n")
            .append("Order Number: ").append(orderNumber).append("\n")
            .append("Payment Status: ").append(paymentStatus).append("\n\n")
            .append("Updated Items:\n")
            .append("---------------------------------\n");

        for (OrderItemEventDto item : updatedItems) {
            body.append("Product: ").append(item.getProductName()).append("\n")
                .append("Quantity: ").append(item.getQuantity()).append("\n")
                .append("Price: ₹").append(item.getPrice()).append("\n")
                .append("Updated Status: ").append(item.getFulfillmentStatus()).append("\n")
                .append("---------------------------------\n");
        }

        body.append("Thank you for shopping with Trueme.\n\n")
            .append("Regards,\n")
            .append("Trueme Team");

        sendEmail(email, subject, body.toString());
    }

    
    @Override
    public void sendOrderCancelledEmail(
            String toEmail,
            String userName,
            String orderNumber,
            List<OrderItemEventDto> items,
            BigDecimal refundAmount) {

        String subject = "Your Order Has Been Cancelled | Order #" + orderNumber;

        StringBuilder body = new StringBuilder();

        body.append("Hello ").append(userName).append(",\n\n")
            .append("Your order has been successfully cancelled.\n\n")
            .append("Order Number: ").append(orderNumber).append("\n\n")
            .append("Cancelled Items:\n")
            .append("---------------------------------\n");

        for (OrderItemEventDto item : items) {
            body.append("- ")
                .append(item.getProductName())
                .append(" | Qty: ").append(item.getQuantity())
                .append(" | Price: ₹").append(item.getPrice())
                .append("\n")
                .append("---------------------------------\n");
        }

        body.append("\n")
            .append("Refund Amount: ₹").append(refundAmount).append("\n\n")
            .append("The refund will be processed to your original payment method.\n")
            .append("If you have any questions, feel free to contact our support team.\n\n")
            .append("Thanks,\n")
            .append("TrueMe Team");

        sendEmail(toEmail, subject, body.toString());

        log.info("Order cancelled email sent to {}", toEmail);
    }


    // COMMON EMAIL SENDER
    private void sendEmail(String to, String subject, String text) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);

        log.info("Email sent to={} subject={}", to, subject);
    }
    
    @Override
    public void sendPaymentStatusEmail(PaymentNotificationEventDto event) {

        String subject;
        String body;

        switch (event.getStatus()) {

            case SUCCEEDED -> {
                subject = "✅ Payment Successful | Order #" + event.getOrderNumber();
                body = """
                        Hi %s,

                        Your payment was successful 🎉

                        Order Number: %s
                        
                        Payment ID: %s
                        
                        Amount Paid: ₹%s

                        Thank you for shopping with Trueme.
                        """
                        .formatted(
                                event.getUserName(),
                                event.getOrderNumber(),
                                event.getStripePaymentId(),
                                event.getAmount());
            }

            case FAILED, CANCELED -> {
                subject = "❌ Payment Failed | Order #" + event.getOrderNumber();
                body = """
                        Hi %s,

                        Unfortunately, your payment could not be completed.

                        Order Number: %s
                        Payment ID: %s
                        Amount: ₹%s
                        Status: %s

                        Please try again.
                        """
                        .formatted(
                                event.getUserName(),
                                event.getOrderNumber(),
                                event.getStripePaymentId(),
                                event.getAmount(),
                                event.getStatus()
                        );
            }

            default -> {
                log.info("No email required for status={}", event.getStatus());
                return;
            }
        }

        //  reuse common sender
        sendEmail(event.getUserEmail(), subject, body);
    }


}
