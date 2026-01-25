package com.trueme.orderservice.exception.handler;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.exception.CartException;
import com.trueme.orderservice.exception.OrderException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ================= CART EXCEPTIONS =================
    @ExceptionHandler(CartException.class)
    public ResponseEntity<ApiResponse> handleCartException(CartException ex) {

        log.warn(
            "CartException occurred | code={} | message={}",
            ex.getErrorCode().getCode(),
            ex.getMessage());

        ApiResponse response = new ApiResponse(
                ex.getMessage(),
                ex.getErrorCode().getCode());

        return new ResponseEntity<>(
                response,
                ex.getErrorCode().getStatus());
    }

    // ================= ORDER EXCEPTIONS =================
    @ExceptionHandler(OrderException.class)
    public ResponseEntity<ApiResponse> handleOrderException(OrderException ex) {

        log.warn(
            "OrderException occurred | code={} | message={}",
            ex.getErrorCode().getCode(),
            ex.getMessage());

        ApiResponse response = new ApiResponse(
                ex.getMessage(),
                ex.getErrorCode().getCode());

        return new ResponseEntity<>(
                response,
                ex.getErrorCode().getStatus());
    }

    // ================= FALLBACK =================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGenericException(Exception ex) {

        log.error("Unhandled exception occurred", ex);

        ApiResponse response = new ApiResponse(
                "Something went wrong",
                "INTERNAL_ERROR");

        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
