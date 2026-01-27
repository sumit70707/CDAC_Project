package com.trume.payment.exception.handler;

import java.util.Arrays;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.trume.payment.dto.ApiResponse;
import com.trume.payment.errorcode.PaymentErrorCode;
import com.trume.payment.exception.PaymentException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	 @ExceptionHandler(PaymentException.class)
	    public ResponseEntity<ApiResponse> handlePaymentException(
	            PaymentException ex) {

	        PaymentErrorCode code = ex.getErrorCode();

	        log.error("Payment exception occurred: {}", ex.getMessage());

	        return ResponseEntity
	                .status(code.getStatus())
	                .body(new ApiResponse(
	                        ex.getMessage(),
	                        code.getCode()
	                ));
	    }

    // 🔹 Validation errors
	 @ExceptionHandler(MethodArgumentNotValidException.class)
	    public ResponseEntity<ApiResponse> handleValidationException(
	            MethodArgumentNotValidException ex) {

	        String message = ex.getBindingResult()
	                .getFieldErrors()
	                .stream()
	                .map(error ->
	                        error.getField() + ": " + error.getDefaultMessage())
	                .findFirst()              // 🔥 keep response simple
	                .orElse("Validation failed");

	        log.warn("Validation failed: {}", ex.getMessage());

	        return ResponseEntity
	                .badRequest()
	                .body(new ApiResponse(
	                        message,
	                        "VALIDATION_400"
	                ));
	    }

	 @ExceptionHandler(HttpMessageNotReadableException.class)
	    public ResponseEntity<ApiResponse> handleHttpMessageNotReadable(
	            HttpMessageNotReadableException ex) {

	        String message = "Invalid request payload";
	        String statusCode = "INVALID_REQUEST_400";

	        Throwable cause = ex.getCause();

	        if (cause instanceof InvalidFormatException ife
	                && ife.getTargetType().isEnum()) {

	            String fieldName = ife.getPath().get(0).getFieldName();
	            Object[] allowedValues =
	                    ife.getTargetType().getEnumConstants();

	            message = fieldName
	                    + " must be one of "
	                    + Arrays.toString(allowedValues);

	            statusCode = "INVALID_ENUM_VALUE";
	        }

	        log.warn("Invalid request payload: {}", ex.getMessage());

	        return ResponseEntity
	                .badRequest()
	                .body(new ApiResponse(
	                        message,
	                        statusCode
	                ));
	    }
    
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