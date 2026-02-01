package com.trueme.payment.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.payment.dto.PaymentCheckoutRequestDto;
import com.trueme.payment.dto.PaymentCheckoutResponseDto;
import com.trueme.payment.dto.PaymentCreateRequestDto;
import com.trueme.payment.dto.PaymentResponseDto;
import com.trueme.payment.dto.StripeCheckoutResponseDto;
import com.trueme.payment.service.PaymentService;
import com.trueme.payment.service.StripeCheckoutService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/internal/payments")
@RequiredArgsConstructor
@Slf4j
public class InternalPaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout")
    public PaymentCheckoutResponseDto createCheckout(
            @RequestBody PaymentCheckoutRequestDto request) {

        log.info(
            "Internal payment checkout | orderId={}",
            request.getOrderId()
        );

     // Create payment AND checkout session
        PaymentResponseDto response =
                paymentService.createPayment(
                        new PaymentCreateRequestDto(
                                request.getOrderId(),
                                request.getOrderNumber(),
                                request.getAmount(),
                                request.getCurrency()
                                
                        )
                );

        // 🔁 Return only checkout URL to Order Service
        return new PaymentCheckoutResponseDto(
                response.getCheckoutUrl()
        );
    }
}
