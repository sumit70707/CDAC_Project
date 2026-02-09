package com.trueme.orderservice.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponseWithData<T> {

    private LocalDateTime timeStamp;
    private String message;
    private String status;
    private T data;

    public ApiResponseWithData(String message, String status, T data) {
        this.message = message;
        this.status = status;
        this.data = data;
        this.timeStamp = LocalDateTime.now();
    }
}
