package com.trueme.payment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByStripePaymentId(String stripePaymentId);

    Optional<Payment> findByOrderIdAndIdempotencyKey(Long orderId, String idempotencyKey);
}
