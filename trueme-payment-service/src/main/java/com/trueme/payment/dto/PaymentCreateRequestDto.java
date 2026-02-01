package com.trueme.payment.dto;

import java.math.BigDecimal;

import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentCreateRequestDto {

    @NotNull
    private Long orderId;
    
    @NotNull
    private String orderNumber;

    @NotNull
    private BigDecimal amount;

    private String currency;
    
    @PrePersist
    protected void onCreate() {

        if (this.currency == null) {
            this.currency = "INR";
        }
    }
}

