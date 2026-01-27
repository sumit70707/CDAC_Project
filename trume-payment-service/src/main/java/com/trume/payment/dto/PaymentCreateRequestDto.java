package com.trume.payment.dto;

import java.math.BigDecimal;

import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PaymentCreateRequestDto {

    @NotNull
    private Long orderId;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private String idempotencyKey;

    private String currency;
    
    @PrePersist
    protected void onCreate() {

        if (this.currency == null) {
            this.currency = "INR";
        }
    }
}

