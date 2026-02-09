package com.trueme.payment.errorcode;

import org.springframework.http.HttpStatus;

public enum PaymentErrorCode {

    PAY_404(HttpStatus.NOT_FOUND, "Payment not found"),
    PAY_400(HttpStatus.BAD_REQUEST, "Invalid payment request"),
    PAY_409(HttpStatus.CONFLICT, "Duplicate payment request"),
    PAY_422(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid payment status transition"),
	PAY_500(HttpStatus.INTERNAL_SERVER_ERROR,"Internal Error");


    private final HttpStatus status;
    private final String defaultMessage;

    PaymentErrorCode(HttpStatus status, String defaultMessage) {
        this.status = status;
        this.defaultMessage = defaultMessage;
    }

    public HttpStatus getStatus() {
        return status;
    }
    
    public String getCode() {
		return name();
	}

    public String getDefaultMessage() {
        return defaultMessage;
    }

}