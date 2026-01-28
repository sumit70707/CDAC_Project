package com.trume.payment.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trume.payment.dto.PaymentCheckoutRequestDto;
import com.trume.payment.dto.PaymentCheckoutResponseDto;
import com.trume.payment.dto.PaymentCreateRequestDto;
import com.trume.payment.dto.PaymentResponseDto;
import com.trume.payment.dto.StripeCheckoutResponseDto;
import com.trume.payment.service.PaymentService;
import com.trume.payment.service.StripeCheckoutService;

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

     // 🔥 Create payment AND checkout session
        PaymentResponseDto response =
                paymentService.createPayment(
                        new PaymentCreateRequestDto(
                                request.getOrderId(),
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
