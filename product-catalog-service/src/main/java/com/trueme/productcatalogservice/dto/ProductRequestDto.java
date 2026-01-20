package com.trueme.productcatalogservice.dto;

import java.math.BigDecimal;

import com.trueme.productcatalogservice.entity.enums.ProductStatus;
import com.trueme.productcatalogservice.entity.enums.ProductType;
import com.trueme.productcatalogservice.entity.enums.SkinType;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ProductRequestDto {

	@NotBlank(message = "Product name is required")
	@Size(max = 255, message = "Product name must not exceed 255 characters")
	private String name;

	@NotBlank(message = "Product description is required")
	@Size(max = 5000, message = "Description is too long")
	private String description;

	@NotBlank(message = "Product imageUrl is required")
	@Size(max = 1000, message = "Image URL must not exceed 1000 characters")
	private String imageUrl;

	@NotNull(message = "Price is required")
	@DecimalMin(value = "10.0", inclusive = true, message = "Price must be > 10")
	@Digits(integer = 10, fraction = 2, message = "Invalid price format")
	private BigDecimal price;
	
	@NotNull(message = "Product quantity in ml is required")
	@Min(value = 10, message = "ml must be >= 10")
	private Integer ml;


	@NotNull(message = "Quantity is required")
	@Min(value = 5, message = "Quantity must be >= 5")
	private Integer qty;

	private ProductStatus productStatus;

	@NotNull(message = "Skin type is required")
	private SkinType skinType;

	@NotNull(message = "Product type is required")
	private ProductType productType;

	@DecimalMin(value = "0.0", message = "pH value must be >= 0.0")
	@DecimalMax(value = "14.0", message = "pH value must be <= 14.0")
	@Digits(integer = 2, fraction = 1, message = "pH value must have at most 1 decimal place")
	private BigDecimal productPhValue;
}
