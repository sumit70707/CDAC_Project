package com.trume.payment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trume.payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByStripePaymentId(String stripePaymentId);

    Optional<Payment> findByOrderIdAndIdempotencyKey(Long orderId, String idempotencyKey);
}
