package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.request.DashboardQueryRequest;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.entity.DatasetRecord;
import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.exception.BadRequestException;
import com.recursiondev.dashboard.repository.DatasetRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class DashboardQueryServiceTest {

    @Autowired
    private DashboardQueryService queryService;

    @Autowired
    private DatasetRecordRepository recordRepository;

    @BeforeEach
    void setUp() {
        recordRepository.deleteAll();

        // Populate test records for dataset "sales-2024"
        recordRepository.save(new DatasetRecord("sales-2024", "Electronics", "revenue", 1200.0));
        recordRepository.save(new DatasetRecord("sales-2024", "Electronics", "revenue", 800.0));
        recordRepository.save(new DatasetRecord("sales-2024", "Clothing", "revenue", 400.0));
        recordRepository.save(new DatasetRecord("sales-2024", "Clothing", "revenue", 600.0));
        recordRepository.save(new DatasetRecord("sales-2024", "Groceries", "revenue", 200.0));

        // Another dataset to ensure data isolation
        recordRepository.save(new DatasetRecord("other-dataset", "Electronics", "revenue", 9999.0));
    }

    @Test
    @DisplayName("SUM aggregation with GROUP BY dimension")
    void testSumWithGroupBy() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setGroupByField("dimension");
        request.setMetricField("metricValue");
        request.setAggregationType(AggregationType.SUM);
        request.setSortOrder("DESC");

        List<MetricResult> results = queryService.executeQuery(request);

        assertNotNull(results);
        assertEquals(3, results.size());

        // First should be Electronics with 2000.0 (1200 + 800)
        assertEquals("Electronics", results.get(0).getGroupKey());
        assertEquals(2000.0, results.get(0).getValue());
        assertEquals(2L, results.get(0).getCount());

        // Second should be Clothing with 1000.0 (400 + 600)
        assertEquals("Clothing", results.get(1).getGroupKey());
        assertEquals(1000.0, results.get(1).getValue());
        assertEquals(2L, results.get(1).getCount());

        // Third should be Groceries with 200.0
        assertEquals("Groceries", results.get(2).getGroupKey());
        assertEquals(200.0, results.get(2).getValue());
        assertEquals(1L, results.get(2).getCount());
    }

    @Test
    @DisplayName("AVG aggregation with GROUP BY dimension")
    void testAvgWithGroupBy() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setGroupByField("dimension");
        request.setMetricField("metricValue");
        request.setAggregationType(AggregationType.AVG);

        List<MetricResult> results = queryService.executeQuery(request);

        assertNotNull(results);
        assertEquals(3, results.size());

        MetricResult electronics = results.stream()
                .filter(r -> "Electronics".equals(r.getGroupKey()))
                .findFirst().orElseThrow();
        assertEquals(1000.0, electronics.getValue(), 0.001); // (1200 + 800) / 2
    }

    @Test
    @DisplayName("COUNT aggregation with GROUP BY dimension")
    void testCountWithGroupBy() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setGroupByField("dimension");
        request.setMetricField("metricValue");
        request.setAggregationType(AggregationType.COUNT);

        List<MetricResult> results = queryService.executeQuery(request);

        assertNotNull(results);
        assertEquals(3, results.size());

        MetricResult clothing = results.stream()
                .filter(r -> "Clothing".equals(r.getGroupKey()))
                .findFirst().orElseThrow();
        assertEquals(2.0, clothing.getValue());
    }

    @Test
    @DisplayName("MIN and MAX aggregation")
    void testMinAndMaxAggregation() {
        DashboardQueryRequest minReq = new DashboardQueryRequest();
        minReq.setDatasetId("sales-2024");
        minReq.setGroupByField("dimension");
        minReq.setMetricField("metricValue");
        minReq.setAggregationType(AggregationType.MIN);

        List<MetricResult> minResults = queryService.executeQuery(minReq);
        MetricResult electronicsMin = minResults.stream()
                .filter(r -> "Electronics".equals(r.getGroupKey()))
                .findFirst().orElseThrow();
        assertEquals(800.0, electronicsMin.getValue());

        DashboardQueryRequest maxReq = new DashboardQueryRequest();
        maxReq.setDatasetId("sales-2024");
        maxReq.setGroupByField("dimension");
        maxReq.setMetricField("metricValue");
        maxReq.setAggregationType(AggregationType.MAX);

        List<MetricResult> maxResults = queryService.executeQuery(maxReq);
        MetricResult electronicsMax = maxResults.stream()
                .filter(r -> "Electronics".equals(r.getGroupKey()))
                .findFirst().orElseThrow();
        assertEquals(1200.0, electronicsMax.getValue());
    }

    @Test
    @DisplayName("Global dataset aggregation without GROUP BY (Total KPI)")
    void testGlobalDatasetAggregation() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setMetricField("metricValue");
        request.setAggregationType(AggregationType.SUM);

        List<MetricResult> results = queryService.executeQuery(request);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("TOTAL", results.get(0).getGroupKey());
        assertEquals(3200.0, results.get(0).getValue()); // 1200 + 800 + 400 + 600 + 200
        assertEquals(5L, results.get(0).getCount());
    }

    @Test
    @DisplayName("Filtering by dimension and metric value range")
    void testFilteringAndRange() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setGroupByField("dimension");
        request.setMetricField("metricValue");
        request.setAggregationType(AggregationType.SUM);
        request.setMinMetricValue(500.0); // Only 1200, 800, 600 qualify

        List<MetricResult> results = queryService.executeQuery(request);

        assertNotNull(results);
        // Groceries (200) and Clothing record (400) excluded
        assertEquals(2, results.size());

        MetricResult clothing = results.stream()
                .filter(r -> "Clothing".equals(r.getGroupKey()))
                .findFirst().orElseThrow();
        assertEquals(600.0, clothing.getValue());
        assertEquals(1L, clothing.getCount());
    }

    @Test
    @DisplayName("Security: Invalid groupByField must throw BadRequestException")
    void testSecurityDisallowedGroupByField() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setGroupByField("password"); // Not in allow-list
        request.setAggregationType(AggregationType.SUM);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            queryService.executeQuery(request);
        });

        assertTrue(ex.getMessage().contains("Invalid groupByField"));
    }

    @Test
    @DisplayName("Security: SQL injection attempt in metricField must be rejected")
    void testSecuritySqlInjectionInMetricField() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setMetricField("metricValue; DROP TABLE users; --");
        request.setAggregationType(AggregationType.SUM);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            queryService.executeQuery(request);
        });

        assertTrue(ex.getMessage().contains("Invalid metricField"));
    }

    @Test
    @DisplayName("Security: Invalid sortOrder must throw BadRequestException")
    void testSecurityInvalidSortOrder() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setAggregationType(AggregationType.SUM);
        request.setSortOrder("INVALID_ORDER");

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            queryService.executeQuery(request);
        });

        assertTrue(ex.getMessage().contains("Invalid sortOrder"));
    }

    @Test
    @DisplayName("Validation: Missing datasetId must throw BadRequestException")
    void testMissingDatasetId() {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("");
        request.setAggregationType(AggregationType.SUM);

        assertThrows(BadRequestException.class, () -> {
            queryService.executeQuery(request);
        });
    }

    @Test
    @DisplayName("Retrieve allowed fields schema")
    void testGetAllowedFields() {
        Map<String, Object> schema = queryService.getAllowedFields();
        assertNotNull(schema);
        assertTrue(schema.containsKey("allowedGroupFields"));
        assertTrue(schema.containsKey("allowedMetricFields"));
        assertTrue(schema.containsKey("allowedAggregationTypes"));
    }
}
