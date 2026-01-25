package com.trueme.authservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trueme.authservice.entity.User;
import com.trueme.authservice.entity.enums.Role;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);
	
	List<User> findByRole(Role role);
}
