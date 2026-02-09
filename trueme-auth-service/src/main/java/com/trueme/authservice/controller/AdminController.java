package com.trueme.authservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trueme.authservice.dto.DeleteUserRequestDto;
import com.trueme.authservice.dto.UpdateUserRequestDto;
import com.trueme.authservice.dto.UserResponseDto;
import com.trueme.authservice.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
	
	 private final AdminService adminService;

	    @GetMapping("/users")
	    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
	    	
	        List<UserResponseDto> users = adminService.getAllCustomers();
	        
	        return ResponseEntity.ok(users);
	    }

	    @PutMapping("/users/{id}")
	    public ResponseEntity<UserResponseDto> updateUser(
	            @PathVariable Long id,
	            @Valid @RequestBody UpdateUserRequestDto dto) {
	    	
	        UserResponseDto response = adminService.updateCustomer(id, dto);
	        
	        return ResponseEntity.ok(response);
	    }

	    @DeleteMapping("/users/{id}")
	    public ResponseEntity<Void> deleteUser(
	    		@PathVariable Long id,
	    		@Valid @RequestBody DeleteUserRequestDto dto) {
	    	
	        adminService.deleteCustomer(id, dto);
	        
	        return ResponseEntity.noContent().build();
	    }


}
