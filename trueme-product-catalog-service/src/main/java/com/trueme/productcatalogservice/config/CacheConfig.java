package com.trueme.productcatalogservice.config;

import org.springframework.cache.Cache;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class CacheConfig {

    @Bean
    public CacheErrorHandler cacheErrorHandler() {
        return new CacheErrorHandler() {

            @Override
            public void handleCacheGetError(RuntimeException exception,
                                             Cache cache, Object key) {
                log.warn("Redis GET failed for cache={} key={}", cache.getName(), key);
            }

            @Override
            public void handleCachePutError(RuntimeException exception,
                                             Cache cache, Object key, Object value) {
                log.warn("Redis PUT failed for cache={} key={}", cache.getName(), key);
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception,
                                               Cache cache, Object key) {
                log.warn("Redis EVICT failed for cache={} key={}", cache.getName(), key);
            }

            @Override
            public void handleCacheClearError(RuntimeException exception,
                                               Cache cache) {
                log.warn("Redis CLEAR failed for cache={}", cache.getName());
            }
        };
    }
}
