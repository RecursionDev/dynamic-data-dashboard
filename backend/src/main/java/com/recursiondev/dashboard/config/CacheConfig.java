package com.recursiondev.dashboard.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@EnableCaching
public class CacheConfig {

    public static final String QUERY_CACHE = "queryResults";
    public static final String METRIC_CACHE = "metricSummaries";
    public static final String ALLOWED_FIELDS_CACHE = "allowedFields";

    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(Arrays.asList(
                QUERY_CACHE,
                METRIC_CACHE,
                ALLOWED_FIELDS_CACHE
        ));
        return cacheManager;
    }
}
