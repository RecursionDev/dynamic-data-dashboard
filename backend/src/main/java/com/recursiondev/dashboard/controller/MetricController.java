package com.recursiondev.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.recursiondev.dashboard.dto.request.MetricRequest;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.service.MetricService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/metrics")
public class MetricController {

    private final MetricService metricService;

    public MetricController(MetricService metricService) {
        this.metricService = metricService;
    }

    @PostMapping("/query")
    public ResponseEntity<List<MetricResult>> executeMetric(
            @Valid @RequestBody MetricRequest request) {

        return ResponseEntity.ok(metricService.executeMetric(request));
    }
}