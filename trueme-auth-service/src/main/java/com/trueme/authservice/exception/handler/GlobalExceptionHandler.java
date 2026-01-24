package com.trueme.authservice.exception.handler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.trueme.authservice.dto.ApiError;
import com.trueme.authservice.errorcode.AuthErrorCode;
import com.trueme.authservice.exception.AuthException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> handleValidationException(
			MethodArgumentNotValidException ex,
			HttpServletRequest request) {

		List<String> details = ex.getBindingResult()
				.getFieldErrors()
				.stream()
				.map(error ->
				error.getField() + ": " + error.getDefaultMessage())
				.toList();

		ApiError apiError = new ApiError(
				HttpStatus.BAD_REQUEST.value(),
				HttpStatus.BAD_REQUEST.name(),
				"VALIDATION_400",
				"Validation failed",
				request.getRequestURI(),
				details);
		
		log.warn("Validation failed: {}",ex.getMessage());
		
		return ResponseEntity.badRequest().body(apiError);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiError> handleHttpMessageNotReadable(
	        HttpMessageNotReadableException ex,
	        HttpServletRequest request) {

	    String message = "Invalid request payload";
	    List<String> details = new ArrayList<>();

	    Throwable cause = ex.getCause();

	    if (cause instanceof InvalidFormatException ife) {

	        if (ife.getTargetType().isEnum()) {

	            String fieldName = ife.getPath().get(0).getFieldName();
	            Object[] allowedValues = ife.getTargetType().getEnumConstants();

	            message = "Invalid value provided for enum field";

	            details.add(fieldName + " must be one of " + Arrays.toString(allowedValues));
	        }
	    }

	    ApiError apiError = new ApiError(
	            HttpStatus.BAD_REQUEST.value(),
	            HttpStatus.BAD_REQUEST.getReasonPhrase(),
	            "INVALID_ENUM_VALUE",
	            message,
	            request.getRequestURI(),
	            details);

	    log.warn("Invalid value provided for enum field: {}",ex.getMessage());
	    
	    return ResponseEntity.badRequest().body(apiError);
	}
	
	@ExceptionHandler(AuthException.class)
	public ResponseEntity<ApiError> handleAuthException(
	        AuthException ex,
	        HttpServletRequest request) {

	    AuthErrorCode code = ex.getErrorCode();

	    ApiError error = new ApiError(
	            code.getStatus().value(),
	            code.getStatus().getReasonPhrase(),
	            code.getCode(),
	            ex.getMessage(),
	            request.getRequestURI(),
	            List.of());
	    
	    log.error("AuthException: {}",ex.getMessage());

	    return ResponseEntity.status(code.getStatus()).body(error);
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> handleGenericException(
			Exception ex,
			HttpServletRequest request) {

		ApiError error = new ApiError(
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				HttpStatus.INTERNAL_SERVER_ERROR.name(),
				"PROD_500",
				"Internal server error",
				request.getRequestURI(),
				List.of());

		log.error("Exception: {}",ex.getMessage());
		
		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(error);
	}


}
