package com.trueme.authservice.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.trueme.authservice.entity.User;
import com.trueme.authservice.entity.enums.Role;
import com.trueme.authservice.entity.enums.Status;
import com.trueme.authservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SystemUserSeeder implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) {

		createAdminIfNotExists();
		createSellerIfNotExists();
	}

	private void createAdminIfNotExists() {
		// run only once
		if (userRepository.findByEmail("trume.skincare@gmail.com").isPresent()) {
			return;
		}

		User admin = new User();
		admin.setEmail("trume.skincare@gmail.com");
		admin.setFirstName("TrueMe");
		admin.setLastName("Skincare");
		admin.setPhone("9890567709");
		admin.setPassword(passwordEncoder.encode("admin123")); // NORMAL password
		admin.setRole(Role.ADMIN);
		admin.setStatus(Status.ACTIVE);
		admin.setIsPremium(false);

		userRepository.save(admin);

		System.out.println("✅ Admin created: trume.skincare@gmail.com / admin123");
	}

	private void createSellerIfNotExists() {
		if (userRepository.findByEmail("seller@trueme.com").isPresent()) {
			return;
		}

		User seller = new User();
		seller.setEmail("seller@trueme.com");
		seller.setFirstName("Seller");
		seller.setLastName("Trume");
		seller.setPassword(passwordEncoder.encode("seller123"));
		seller.setRole(Role.SELLER);
		seller.setStatus(Status.ACTIVE);
		seller.setIsPremium(false);
		seller.setPhone("9325365861");

		userRepository.save(seller);

		System.out.println("✅ SELLER created: seller@trueme.com / seller123");
	}
}

