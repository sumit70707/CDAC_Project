package com.trueme.authservice.service.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.modelmapper.ModelMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trueme.authservice.client.NotificationClient;
import com.trueme.authservice.dto.AuthResponseDto;
import com.trueme.authservice.dto.ForgotPasswordRequestDto;
import com.trueme.authservice.dto.LoginRequestDto;
import com.trueme.authservice.dto.RegisterRequestDto;
import com.trueme.authservice.dto.SendOtpEmailRequestDto;
import com.trueme.authservice.dto.UserRegisteredEventDto;
import com.trueme.authservice.dto.UserResponseDto;
import com.trueme.authservice.dto.VerifyEmailOtpRequestDto;
import com.trueme.authservice.entity.User;
import com.trueme.authservice.entity.enums.Status;
import com.trueme.authservice.errorcode.AuthErrorCode;
import com.trueme.authservice.exception.AuthException;
import com.trueme.authservice.exception.EmailAlreadyRegisteredException;
import com.trueme.authservice.exception.OtpException;
import com.trueme.authservice.kafka.UserRegistrationEventProducer;
import com.trueme.authservice.repository.UserRepository;
import com.trueme.authservice.security.JwtUtil;
import com.trueme.authservice.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

//TODO DeleteUser GetallUSers UpdateUser Logout

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final ModelMapper modelMapper;
	private final NotificationClient notificationClient;
	private final RedisTemplate<String, Object> redisTemplate;
	private static final SecureRandom SECURE_RANDOM = new SecureRandom();
	private final UserRegistrationEventProducer eventProducer;



	@Override
	public String sendEmailOtp(String email) {

		// 1️ Check if email already registered
		if (userRepository.existsByEmail(email)) {
			throw new EmailAlreadyRegisteredException("Email already registered");
		}

		String resendKey = "email-otp-resend:" + email;
		String otpKey = "email-otp:" + email;

		// 2️ Atomic resend counter
		Long resendCount = redisTemplate.opsForValue().increment(resendKey);

		if (resendCount != null && resendCount == 1) {
			// first time → set TTL
			redisTemplate.expire(resendKey, 15, TimeUnit.MINUTES);
		}

		if (resendCount != null && resendCount > 3) {
			throw new OtpException("Too many OTP requests. Please try later.");
		}

		// 3️ Generate OTP
		String otp = generateOtp(); // 6-digit
		String otpHash = passwordEncoder.encode(otp);

		// 4️ Store OTP in Redis (overwrite old OTP)
		Map<String, Object> otpData = new HashMap<>();
		otpData.put("otpHash", otpHash);
		otpData.put("attempts", 0);

		redisTemplate.opsForValue().set(
				otpKey,otpData,5,TimeUnit.MINUTES);
		
		log.info("Email : {} || OTP :{}",email,otp);
		
		SendOtpEmailRequestDto dto=new SendOtpEmailRequestDto(email, otp);
		
		// 5️ Call Notification Service (SYNC)
		notificationClient.sendOtpEmail(dto);

		log.info("OTP sent to email={}", email);
		return "OTP sent successfully";
	}

	private String generateOtp() {
		int otp = 100000 + SECURE_RANDOM.nextInt(900000);
		return String.valueOf(otp);
	}

	@Override
	public String verifyEmailOtp(VerifyEmailOtpRequestDto dto) {

		String email = dto.getEmail();
		String otpKey = "email-otp:" + email;
		String verifiedKey = "email-verified:" + email;

		Map<String, Object> otpData =
				(Map<String, Object>) redisTemplate.opsForValue().get(otpKey);

		if (otpData == null) {
			throw new OtpException("OTP expired. Please resend.");
		}

		int attempts = (int) otpData.get("attempts");
		if (attempts >= 5) {
			redisTemplate.delete(otpKey);
			throw new OtpException("Too many attempts. Please resend OTP.");
		}

		String storedHash = (String) otpData.get("otpHash");

		// 1️ Compare OTP
		if (!passwordEncoder.matches(dto.getOtp(), storedHash)) {
			otpData.put("attempts", attempts + 1);
			redisTemplate.opsForValue().set(
					otpKey,otpData,redisTemplate.getExpire(otpKey),
					TimeUnit.SECONDS);

			throw new OtpException("Invalid OTP");
		}

		// 2️ OTP valid → delete OTP key
		redisTemplate.delete(otpKey);

		// 3️ Store verification proof (TTL 10 min)
		redisTemplate.opsForValue().set(verifiedKey, "1", 10, TimeUnit.MINUTES);

		log.info("Email verified successfully: {}", email);
		return "Email verified successfully";
	}



	@Override
	public AuthResponseDto register(RegisterRequestDto requestDto) {

		String email = requestDto.getEmail();
		String verifiedKey = "email-verified:" + email;

		//  Check if email verification proof exists
		Boolean isVerified = redisTemplate.hasKey(verifiedKey);
		if (Boolean.FALSE.equals(isVerified)) {
			throw new AuthException(AuthErrorCode.AUTH_403_EMAIL_NOT_VERIFIED);
		}

		if (userRepository.findByEmail(requestDto.getEmail()).isPresent()) {
			throw new AuthException(AuthErrorCode.AUTH_409_EMAIL_EXISTS);
		}

		log.info("User Registration Request with RegisterRequestDto: {}",requestDto);

		User user = modelMapper.map(requestDto, User.class);

		user.setPassword(passwordEncoder.encode(requestDto.getPassword()));

		User savedUser = userRepository.save(user);
		
		//kafka inform publish Event
		UserRegisteredEventDto event = new UserRegisteredEventDto(
		        savedUser.getId(),
		        savedUser.getEmail(),
		        savedUser.getFirstName());

		eventProducer.publishUserRegisteredEvent(event);
		
	    // Cleanup verification proof emaik
	    redisTemplate.delete(verifiedKey);

		String token = jwtUtil.generateToken(savedUser);

		UserResponseDto userResponseDto=modelMapper.map(savedUser, UserResponseDto.class);

		log.info("User registered successfully with userId: {}",userResponseDto.getId());

		return AuthResponseDto.builder()
				.accessToken(token)
				.user(userResponseDto)
				.build();
	}

	@Override
	public AuthResponseDto login(LoginRequestDto request) {

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new AuthException(AuthErrorCode.AUTH_401_INVALID_CREDENTIALS));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new AuthException(AuthErrorCode.AUTH_401_INVALID_CREDENTIALS);
		}

		if (user.getStatus() != Status.ACTIVE) {
			throw new AuthException(AuthErrorCode.AUTH_403_ACCOUNT_DISABLED);
		}

		log.info("Login request come for Email: {}",request.getEmail());

		user.setLastLogin(LocalDateTime.now());

		String token = jwtUtil.generateToken(user);

		UserResponseDto userResponseDto=modelMapper.map(user, UserResponseDto.class);

		log.info("Login successfull for User: {}",userResponseDto);

		return AuthResponseDto.builder()
				.accessToken(token)
				.user(userResponseDto)
				.build();
	}

	//	@Override
	//	public List<UserResponseDto> getAllUsers() {
	//		
	//		return userRepository.findAll()
	//	            .stream()
	//	            .map(user -> modelMapper.map(user, UserResponseDto.class))
	//	            .toList();
	//	}

	@Override
	public String sendForgotPasswordOtp(String email) {

	    // 1️ Check user exists
	    if (!userRepository.existsByEmail(email)) {
	        throw new AuthException(AuthErrorCode.AUTH_404_USER_NOT_FOUND);
	    }

	    String resendKey = "forgot-otp-resend:" + email;
	    String otpKey = "forgot-otp:" + email;

	    Long resendCount = redisTemplate.opsForValue().increment(resendKey);

	    if (resendCount != null && resendCount == 1) {
	        redisTemplate.expire(resendKey, 15, TimeUnit.MINUTES);
	    }

	    if (resendCount != null && resendCount > 3) {
	        throw new OtpException("Too many OTP requests. Try later.");
	    }

	    String otp = generateOtp();
	    String otpHash = passwordEncoder.encode(otp);

	    Map<String, Object> otpData = new HashMap<>();
	    otpData.put("otpHash", otpHash);
	    otpData.put("attempts", 0);

	    redisTemplate.opsForValue().set(
	            otpKey, otpData, 5, TimeUnit.MINUTES);

	    SendOtpEmailRequestDto emailDto =
	            new SendOtpEmailRequestDto(email, otp);

	    notificationClient.sendOtpEmail(emailDto);

	    log.info("Forgot password OTP sent to {}", email);

	    return "OTP sent for password reset";
	}
	
	@Override
	public String resetPassword(ForgotPasswordRequestDto dto) {

	    String email = dto.getEmail();
	    String otpKey = "forgot-otp:" + email;

	    Map<String, Object> otpData =
	            (Map<String, Object>) redisTemplate.opsForValue().get(otpKey);

	    if (otpData == null) {
	        throw new OtpException("OTP expired or not requested");
	    }

	    int attempts = (int) otpData.get("attempts");
	    if (attempts >= 5) {
	        redisTemplate.delete(otpKey);
	        throw new OtpException("Too many invalid attempts");
	    }

	    String storedHash = (String) otpData.get("otpHash");

	    if (!passwordEncoder.matches(dto.getOtp(), storedHash)) {
	        otpData.put("attempts", attempts + 1);
	        redisTemplate.opsForValue().set(
	                otpKey,
	                otpData,
	                redisTemplate.getExpire(otpKey),
	                TimeUnit.SECONDS);

	        throw new OtpException("Invalid OTP");
	    }

	    // OTP VALID → update password
	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() ->
	                    new AuthException(AuthErrorCode.AUTH_404_USER_NOT_FOUND));

	    user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
	    userRepository.save(user);

	    // cleanup
	    redisTemplate.delete(otpKey);

	    log.info("Password reset successfully for {}", email);

	    return "Password reset successfully";
	}



}
