package com.trueme.authservice.dto;

import com.trueme.authservice.entity.enums.Status;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteUserRequestDto {

	@NotNull(message = "Status is required")
	private Status status;   // ACTIVE or SUSPENDED

}
