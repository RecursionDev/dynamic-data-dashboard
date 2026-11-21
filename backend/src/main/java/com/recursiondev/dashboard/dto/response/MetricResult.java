package com.recursiondev.dashboard.dto.response;

public record MetricResult(
        String group,
        Number result
) {}