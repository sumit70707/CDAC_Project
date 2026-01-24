package com.trueme.authservice.errorcode;

import org.springframework.http.HttpStatus;

public enum AuthErrorCode {

    AUTH_401_INVALID_CREDENTIALS(
    		HttpStatus.UNAUTHORIZED,"Invalid email or password"),

    AUTH_409_EMAIL_EXISTS(
            HttpStatus.CONFLICT,"Email already registered"),

    AUTH_403_ACCOUNT_DISABLED(
            HttpStatus.FORBIDDEN,"Account is disabled"),
	
	AUTH_404_ADDRESS_NOT_FOUND(
            HttpStatus.NOT_FOUND,"Address not found"),

    AUTH_409_ADDRESS_ALREADY_EXISTS(
            HttpStatus.CONFLICT,"Address already exists for user"),

    AUTH_403_ADDRESS_ACCESS_DENIED(
            HttpStatus.FORBIDDEN,"You are not allowed to access this address");

    private final HttpStatus status;
    private final String defaultMessage;

    AuthErrorCode(HttpStatus status, String defaultMessage) {
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
