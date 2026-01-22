package com.trueme.productcatalogservice.config;

import java.time.Duration;
import java.util.List;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.trueme.productcatalogservice.dto.ProductResponseDto;
import com.trueme.productcatalogservice.dto.WishlistResponseDto;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        ObjectMapper mapper = JsonMapper.builder()
                .addModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .build();

        //product Cache
        Jackson2JsonRedisSerializer<ProductResponseDto> productSerializer =
                new Jackson2JsonRedisSerializer<>(mapper, ProductResponseDto.class);

        RedisCacheConfiguration productCacheConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .serializeKeysWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(new StringRedisSerializer()))
                        .serializeValuesWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(productSerializer));

        // wishlist cache

        Jackson2JsonRedisSerializer<List<WishlistResponseDto>> wishlistSerializer =
                new Jackson2JsonRedisSerializer<>(
                        mapper,
                        (Class<List<WishlistResponseDto>>) (Class<?>) List.class);

        RedisCacheConfiguration wishlistCacheConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .serializeKeysWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(new StringRedisSerializer()))
                        .serializeValuesWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(wishlistSerializer))
                        .entryTtl(Duration.ofMinutes(10)); // after 10 min DB call

        //cachce manager

        return RedisCacheManager.builder(connectionFactory)
                .withCacheConfiguration("product", productCacheConfig)
                .withCacheConfiguration("wishlist", wishlistCacheConfig)
                .build();
    }
}