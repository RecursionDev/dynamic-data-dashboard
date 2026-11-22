package com.recursiondev.dashboard.controller;

import com.recursiondev.dashboard.dto.response.ApiResponse;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.service.MetricService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
public class MetricController {

    private final MetricService metricService;

    public MetricController(MetricService metricService) {
        this.metricService = metricService;
    }

    @GetMapping("/kpi")
    public ResponseEntity<ApiResponse<MetricResult>> getKpi(
            @RequestParam String datasetId,
            @RequestParam(defaultValue = "metricValue") String metricField,
            @RequestParam(defaultValue = "SUM") AggregationType aggregationType
    ) {
        MetricResult result = metricService.computeKpi(datasetId, metricField, aggregationType);
        return ResponseEntity.ok(ApiResponse.success("KPI computed successfully", result));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getSummary(
            @RequestParam String datasetId,
            @RequestParam(defaultValue = "metricValue") String metricField
    ) {
        Map<String, Double> summary = metricService.getSummaryMetrics(datasetId, metricField);
        return ResponseEntity.ok(ApiResponse.success("Summary metrics computed successfully", summary));
    }

    @GetMapping("/chart")
    public ResponseEntity<ApiResponse<List<MetricResult>>> getChartData(
            @RequestParam String datasetId,
            @RequestParam String groupByField,
            @RequestParam(defaultValue = "metricValue") String metricField,
            @RequestParam(defaultValue = "SUM") AggregationType aggregationType
    ) {
        List<MetricResult> results = metricService.computeChartData(datasetId, groupByField, metricField, aggregationType);
        return ResponseEntity.ok(ApiResponse.success("Chart data computed successfully", results));
    }
}
