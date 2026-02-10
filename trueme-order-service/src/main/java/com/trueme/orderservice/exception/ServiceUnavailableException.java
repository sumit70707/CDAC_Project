package com.trueme.orderservice.exception;

import com.trueme.orderservice.errorcode.ServiceErrorCode;

public class ServiceUnavailableException extends RuntimeException {
	
	  private final ServiceErrorCode errorCode;

	    public ServiceUnavailableException(ServiceErrorCode errorCode) {
	        super(errorCode.getDefaultMessage());
	        this.errorCode = errorCode;
	    }

	    public ServiceUnavailableException(ServiceErrorCode errorCode, String message) {
	        super(message);
	        this.errorCode = errorCode;
	    }

	    public ServiceErrorCode getErrorCode() {
	        return errorCode;
	    }
	}
