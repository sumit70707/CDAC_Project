package com.trueme.payment.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.payment.dto.ApiResponse;
import com.trueme.payment.dto.PaymentCreateRequestDto;
import com.trueme.payment.dto.PaymentResponseDto;
import com.trueme.payment.dto.PaymentStatusUpdateRequestDto;
import com.trueme.payment.entity.enums.PaymentStatus;
import com.trueme.payment.exception.payment.InvalidPaymentStatusException;
import com.trueme.payment.service.PaymentService;
import com.trueme.payment.service.StripeCheckoutService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final StripeCheckoutService stripeCheckoutService;

    @PostMapping
    public ResponseEntity<PaymentResponseDto> createPayment(
            @RequestBody PaymentCreateRequestDto request) {

        PaymentResponseDto response =
                paymentService.createPayment(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/status")
    public ResponseEntity<PaymentResponseDto> updatePaymentStatus(
            @RequestBody PaymentStatusUpdateRequestDto request) {


        PaymentResponseDto response =
                paymentService.updatePaymentStatus(request);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/success")
    public ResponseEntity<ApiResponse> paymentSuccess(
            @RequestParam("session_id") String sessionId) {


        boolean isPaid = stripeCheckoutService.verifyPayment(sessionId);

        if (!isPaid) {
            throw new InvalidPaymentStatusException(
                    "Stripe payment not completed for sessionId: " + sessionId);
        }

//        paymentService.updatePaymentStatus(
//                new PaymentStatusUpdateRequestDto(
//                        sessionId,PaymentStatus.SUCCEEDED));

        return ResponseEntity.ok(
                new ApiResponse("Payment successful","PAYMENT_SUCCESS"));
    }



    @GetMapping("/cancel")
    public ResponseEntity<ApiResponse> paymentCancel(
            @RequestParam("session_id") String sessionId) {

        PaymentStatus resultStatus =
                paymentService.cancelPayment(sessionId);

        if (resultStatus == PaymentStatus.CANCELED) {
            return ResponseEntity.ok(
                new ApiResponse("Payment cancelled","PAYMENT_CANCELLED"));
        }

        return ResponseEntity.ok(
            new ApiResponse("No action performed","PAYMENT_STATUS: "+resultStatus));
    }


}