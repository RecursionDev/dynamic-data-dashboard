package com.recursiondev.dashboard.dto.request;

import com.recursiondev.dashboard.enums.AggregationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MetricRequest(

        @NotBlank(message = "Group by field is required")
        String groupBy,

        @NotNull(message = "Aggregation type is required")
        AggregationType aggregation,

        @NotBlank(message = "Field is required")
        String field

) {}