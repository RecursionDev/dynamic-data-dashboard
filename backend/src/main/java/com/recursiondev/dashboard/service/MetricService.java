package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.config.CacheConfig;
import com.recursiondev.dashboard.dto.request.DashboardQueryRequest;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.enums.AggregationType;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MetricService {

    private final DashboardQueryService queryService;

    public MetricService(DashboardQueryService queryService) {
        this.queryService = queryService;
    }

    /**
     * Compute a single aggregate KPI metric for a dataset.
     */
    public MetricResult computeKpi(String datasetId, String metricField, AggregationType aggregationType) {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId(datasetId);
        request.setMetricField(metricField);
        request.setAggregationType(aggregationType);

        List<MetricResult> results = queryService.executeQuery(request);
        return results.isEmpty() ? new MetricResult("TOTAL", 0.0, 0L) : results.get(0);
    }

    /**
     * Compute summary metrics (SUM, AVG, MIN, MAX, COUNT) for a dataset.
     */
    @Cacheable(value = CacheConfig.METRIC_CACHE, key = "#datasetId + '-' + #metricField")
    public Map<String, Double> getSummaryMetrics(String datasetId, String metricField) {
        Map<String, Double> summary = new LinkedHashMap<>();

        for (AggregationType type : AggregationType.values()) {
            MetricResult result = computeKpi(datasetId, metricField, type);
            summary.put(type.name(), result.getValue());
        }

        return summary;
    }

    /**
     * Compute grouped metrics for charts (e.g. Bar, Line, Pie).
     */
    public List<MetricResult> computeChartData(String datasetId, String groupByField, String metricField, AggregationType aggregationType) {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId(datasetId);
        request.setGroupByField(groupByField);
        request.setMetricField(metricField);
        request.setAggregationType(aggregationType);

        return queryService.executeQuery(request);
    }
}
