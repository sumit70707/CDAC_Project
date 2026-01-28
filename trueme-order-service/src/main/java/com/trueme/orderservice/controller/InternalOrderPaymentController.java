package com.trueme.orderservice.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.orderservice.dto.OrderPaymentStatusUpdateRequestDto;
import com.trueme.orderservice.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/internal/orders")
@RequiredArgsConstructor
@Slf4j
public class InternalOrderPaymentController {

    private final OrderService orderService;

    @PutMapping("/payment-status")
    public ResponseEntity<Void> updatePaymentStatus(
            @RequestBody OrderPaymentStatusUpdateRequestDto request) {
    	log.info("************************************");
    	
    	log.info("Comes here :{} || status =={}",request,request.getPaymentStatusFromPaymentService());
        log.info(
            "Internal payment status update | orderId={}, status={}",
            request.getOrderId(),
            request.getPaymentId(),
            request.getPaymentStatusFromPaymentService()
        );

        orderService.updatePaymentStatusByPaymentService(
                request.getOrderId(),
                request.getPaymentId(),
                request.getPaymentStatusFromPaymentService());

        return ResponseEntity.ok().build();
    }
}
