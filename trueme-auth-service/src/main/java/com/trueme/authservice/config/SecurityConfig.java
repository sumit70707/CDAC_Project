package com.trueme.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	//    @Bean
	//    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	//
	//        http
	//            .csrf(csrf -> csrf.disable())
	//            .authorizeHttpRequests(auth -> auth
	//                .requestMatchers("/auth/**", "/actuator/**").permitAll()
	//                .anyRequest().authenticated()
	//            );
	//
	//        return http.build();
	//    }

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http
		.csrf(csrf -> csrf.disable())
		.authorizeHttpRequests(auth -> auth
				// Public auth APIs ONLY
				.requestMatchers(
//						"/auth/login",
//						"/auth/register",
//						"/auth/forgot-password",
//						"/auth/email/send-otp",
//						"/auth/email/verify-otp"
						"/auth/**"
						).permitAll()
				.requestMatchers(
						"/swagger-ui.html",
						"/swagger-ui/**",
						"/v3/api-docs/**"
						).permitAll()
				.requestMatchers("/internal/**").permitAll()

				// Actuator
				.requestMatchers("/actuator/**").permitAll()

				.anyRequest().authenticated())
		.oauth2ResourceServer(oauth2 ->
		oauth2.jwt(Customizer.withDefaults())
				);

		return http.build();
	}
}
