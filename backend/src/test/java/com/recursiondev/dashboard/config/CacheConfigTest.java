package com.recursiondev.dashboard.config;

import com.recursiondev.dashboard.dto.request.DashboardQueryRequest;
import com.recursiondev.dashboard.dto.request.DatasetRecordRequest;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.entity.DatasetRecord;
import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.repository.DatasetRecordRepository;
import com.recursiondev.dashboard.service.DashboardQueryService;
import com.recursiondev.dashboard.service.DatasetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CacheConfigTest {

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private DashboardQueryService queryService;

    @Autowired
    private DatasetService datasetService;

    @Autowired
    private DatasetRecordRepository recordRepository;

    @BeforeEach
    void setUp() {
        recordRepository.deleteAll();

        // Clear all caches before each test
        for (String cacheName : cacheManager.getCacheNames()) {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        }

        // Setup test data
        recordRepository.save(new DatasetRecord("cache-test-ds", "Tech", "revenue", 500.0));
        recordRepository.save(new DatasetRecord("cache-test-ds", "Tech", "revenue", 700.0));
    }

    @Test
    @DisplayName("CacheManager initializes expected cache names")
    void testCacheManagerConfiguration() {
        assertNotNull(cacheManager);
        assertTrue(cacheManager.getCacheNames().contains(CacheConfig.QUERY_CACHE));
        assertTrue(cacheManager.getCacheNames().contains(CacheConfig.METRIC_CACHE));
        assertTrue(cacheManager.getCacheNames().contains(CacheConfig.ALLOWED_FIELDS_CACHE));
    }

    @Test
    @DisplayName("Query results are cached on subsequent calls")
    void testQueryResultsAreCached() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("cache-test-ds");
        request.setGroupByField("dimension");
        request.setMetricField("metricValue");
        request.setAggregationType(AggregationType.SUM);

        Cache queryCache = cacheManager.getCache(CacheConfig.QUERY_CACHE);
        assertNotNull(queryCache);

        // First call populates cache
        List<MetricResult> firstCall = queryService.executeQuery(request);
        assertEquals(1, firstCall.size());
        assertEquals(1200.0, firstCall.get(0).getValue());

        // Second call should return cached results
        List<MetricResult> secondCall = queryService.executeQuery(request);
        assertEquals(firstCall.size(), secondCall.size());
        assertEquals(firstCall.get(0).getValue(), secondCall.get(0).getValue());
    }

    @Test
    @DisplayName("CacheEvict clears query cache when new dataset record is created")
    void testCacheEvictionOnNewRecord() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("cache-test-ds");
        request.setGroupByField("dimension");
        request.setMetricField("metricValue");
        request.setAggregationType(AggregationType.SUM);

        // Execute query to populate cache (sum = 1200)
        List<MetricResult> initial = queryService.executeQuery(request);
        assertEquals(1200.0, initial.get(0).getValue());

        // Insert new record via DatasetService (triggers @CacheEvict)
        datasetService.createRecord(new DatasetRecordRequest("cache-test-ds", "Tech", "revenue", 300.0));

        // Re-execute query: should reflect new sum (1200 + 300 = 1500)
        List<MetricResult> refreshed = queryService.executeQuery(request);
        assertEquals(1500.0, refreshed.get(0).getValue());
    }

    @Test
    @DisplayName("Allowed fields schema is cached")
    void testAllowedFieldsCached() {
        Cache cache = cacheManager.getCache(CacheConfig.ALLOWED_FIELDS_CACHE);
        assertNotNull(cache);

        var first = queryService.getAllowedFields();
        var second = queryService.getAllowedFields();

        assertNotNull(first);
        assertEquals(first, second);
    }
}
