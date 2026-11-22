package com.recursiondev.dashboard.controller;

import com.recursiondev.dashboard.dto.request.DashboardQueryRequest;
import com.recursiondev.dashboard.dto.response.ApiResponse;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.service.DashboardQueryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboards/query")
public class DashboardQueryController {

    private final DashboardQueryService queryService;

    public DashboardQueryController(DashboardQueryService queryService) {
        this.queryService = queryService;
    }

    /**
     * Executes a dynamic aggregation query with optional GROUP BY, filtering, and sorting.
     */
    @PostMapping
    public ResponseEntity<List<MetricResult>> executeQuery(@Valid @RequestBody DashboardQueryRequest request) {
        List<MetricResult> results = queryService.executeQuery(request);
        return ResponseEntity.ok(results);
    }

    /**
     * Returns the allow-list of queryable fields, metrics, and aggregation types.
     */
    @GetMapping("/allowed-fields")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllowedFields() {
        Map<String, Object> schema = queryService.getAllowedFields();
        return ResponseEntity.ok(ApiResponse.success("Allowed fields retrieved successfully", schema));
    }
}
