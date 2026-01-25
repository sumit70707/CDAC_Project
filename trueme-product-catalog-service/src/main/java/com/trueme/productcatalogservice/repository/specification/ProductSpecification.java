package com.trueme.productcatalogservice.repository.specification;


import com.trueme.productcatalogservice.entity.Product;
import com.trueme.productcatalogservice.entity.enums.*;

import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecification {

	public static Specification<Product> hasProductStatus(ProductStatus status) {
		return (root, query, cb) ->
		status == null ? null : cb.equal(root.get("productStatus"), status);
	}

	public static Specification<Product> hasSkinType(SkinType skinType) {
		return (root, query, cb) ->
		skinType == null ? null : cb.equal(root.get("skinType"), skinType);
	}

	public static Specification<Product> hasProductType(ProductType productType) {
		return (root, query, cb) ->
		productType == null ? null : cb.equal(root.get("productType"), productType);
	}

	public static Specification<Product> priceBetween(
			BigDecimal minPrice, BigDecimal maxPrice) {

		return (root, query, cb) -> {
			if (minPrice == null && maxPrice == null) return null;
			if (minPrice == null) return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
			if (maxPrice == null) return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
			return cb.between(root.get("price"), minPrice, maxPrice);
		};
	}

	public static Specification<Product> phValueBetween(
			BigDecimal minPh, BigDecimal maxPh) {

		return (root, query, cb) -> {
			if (minPh == null && maxPh == null) return null;
			if (minPh == null) return cb.lessThanOrEqualTo(root.get("productPhValue"), maxPh);
			if (maxPh == null) return cb.greaterThanOrEqualTo(root.get("productPhValue"), minPh);
			return cb.between(root.get("productPhValue"), minPh, maxPh);
		};
	}

	public static Specification<Product> isActive() {
		return (root, query, cb) -> cb.isTrue(root.get("isActive"));
	}
}

