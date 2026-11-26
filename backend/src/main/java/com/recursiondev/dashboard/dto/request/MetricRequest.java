package com.recursiondev.dashboard.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MetricRequest {
    @NotBlank
    private String metric;
    @NotBlank
    private String groupBy;

}
