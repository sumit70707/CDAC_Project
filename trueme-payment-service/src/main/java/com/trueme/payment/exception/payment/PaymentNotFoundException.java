package com.trueme.payment.exception.payment;

import com.trueme.payment.errorcode.PaymentErrorCode;
import com.trueme.payment.exception.PaymentException;

public class PaymentNotFoundException extends PaymentException {

    public PaymentNotFoundException(Long paymentId) {
        super(
            PaymentErrorCode.PAY_404,
            "Payment not found with id: " + paymentId);
    }
    
    public PaymentNotFoundException(String  stripePaymentId) {
        super(
            PaymentErrorCode.PAY_404,
            "Payment not found with Stripeid: " + stripePaymentId);
    }
}