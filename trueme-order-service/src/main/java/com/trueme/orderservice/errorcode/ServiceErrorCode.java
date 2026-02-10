package com.trueme.orderservice.errorcode;

import org.springframework.http.HttpStatus;

public enum ServiceErrorCode {
	SERVICE_503(HttpStatus.SERVICE_UNAVAILABLE, "Service is unavailable");

    private final HttpStatus status;
    private final String defaultMessage;

    ServiceErrorCode(HttpStatus status, String defaultMessage) {
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
