package com.trueme.productcatalogservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http
		.csrf(csrf -> csrf.disable())
		.authorizeHttpRequests(auth -> auth
				// Swagger (optional)
				.requestMatchers(
						"/swagger-ui/**",
						"/v3/api-docs/**"
						).permitAll()
				.requestMatchers("/internal/**").permitAll()

				// Everything else requires JWT
				.anyRequest().authenticated()
				)
		.oauth2ResourceServer(oauth2 ->
		oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter()))
				);

		return http.build();
	}

	@Bean
	JwtAuthenticationConverter jwtAuthConverter() {

		JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter =
				new JwtGrantedAuthoritiesConverter();

		// 🔑 IMPORTANT: match your JWT claim
		grantedAuthoritiesConverter.setAuthoritiesClaimName("role");
		grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

		JwtAuthenticationConverter authenticationConverter =
				new JwtAuthenticationConverter();

		authenticationConverter.setJwtGrantedAuthoritiesConverter(
				grantedAuthoritiesConverter
				);

		return authenticationConverter;
	}
}
