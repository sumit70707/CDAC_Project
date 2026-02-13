package com.trueme.orderservice.exception.handler;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.trueme.orderservice.dto.ApiResponse;
import com.trueme.orderservice.errorcode.ProductErrorCode;
import com.trueme.orderservice.exception.CartException;
import com.trueme.orderservice.exception.OrderException;
import com.trueme.orderservice.exception.ProductException;
import com.trueme.orderservice.exception.ServiceUnavailableException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<String> handleAccessDenied(AccessDeniedException ex) {
		
		 log.warn(
		            "AccessDeniedException occurred | code={} | message={}",
		            ex.getMessage());
	    return ResponseEntity.status(HttpStatus.FORBIDDEN)
	            .body("Forbidden");
	}

	
	@ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<ApiResponse> handleCartException(ServiceUnavailableException ex) {

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
    
    //product from catalog service
    @ExceptionHandler(ProductException.class)
    public ResponseEntity<ApiResponse> handleProductException(ProductException ex) {

        ProductErrorCode code = ex.getErrorCode();

        log.error("Product exception occurred: {}", ex.getMessage());

        return ResponseEntity
                .status(code.getStatus())
                .body(new ApiResponse(
                        ex.getMessage(),
                        code.getCode()
                ));
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
