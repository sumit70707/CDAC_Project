package com.trueme.orderservice.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiError {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String errorCode;
    private String message;
    private String path;
    private List<String> details;

    public ApiError(int status,
                    String error,
                    String errorCode,
                    String message,
                    String path,
                    List<String> details) {

        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.errorCode = errorCode;
        this.message = message;
        this.path = path;
        this.details = details;
    }

}