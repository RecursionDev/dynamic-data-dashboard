package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.request.DashboardQueryRequest;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.enums.AggregationType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MetricServiceTest {

    @Mock
    private DashboardQueryService queryService;

    @InjectMocks
    private MetricService metricService;

    @Test
    @DisplayName("computeKpi returns single MetricResult")
    void testComputeKpi() {
        when(queryService.executeQuery(any(DashboardQueryRequest.class)))
                .thenReturn(List.of(new MetricResult("TOTAL", 5000.0, 10L)));

        MetricResult result = metricService.computeKpi("sales-dataset", "metricValue", AggregationType.SUM);

        assertNotNull(result);
        assertEquals("TOTAL", result.getGroupKey());
        assertEquals(5000.0, result.getValue());
        assertEquals(10L, result.getCount());
    }

    @Test
    @DisplayName("getSummaryMetrics computes all 5 aggregation types")
    void testGetSummaryMetrics() {
        when(queryService.executeQuery(any(DashboardQueryRequest.class)))
                .thenReturn(List.of(new MetricResult("TOTAL", 100.0, 5L)));

        Map<String, Double> summary = metricService.getSummaryMetrics("sales-dataset", "metricValue");

        assertNotNull(summary);
        assertEquals(5, summary.size());
        assertTrue(summary.containsKey("SUM"));
        assertTrue(summary.containsKey("COUNT"));
        assertTrue(summary.containsKey("AVG"));
        assertTrue(summary.containsKey("MIN"));
        assertTrue(summary.containsKey("MAX"));
    }

    @Test
    @DisplayName("computeChartData delegates to query service")
    void testComputeChartData() {
        when(queryService.executeQuery(any(DashboardQueryRequest.class)))
                .thenReturn(List.of(
                        new MetricResult("Electronics", 2000.0, 2L),
                        new MetricResult("Clothing", 1000.0, 2L)
                ));

        List<MetricResult> results = metricService.computeChartData("sales-dataset", "dimension", "metricValue", AggregationType.SUM);

        assertEquals(2, results.size());
        assertEquals("Electronics", results.get(0).getGroupKey());
    }
}
