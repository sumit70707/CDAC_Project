package com.trueme.authservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.authservice.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

	Optional<Address> findByUserId(Long userId);

    Optional<Address> findByIdAndUserId(Long id, Long userId);
    
    boolean existsByUserId(Long userId);

    void deleteByUserId(Long userId);
}

