package com.recursiondev.dashboard.dto.request;

import lombok.Data;

@Data
public class MetricRequest {
    private String metric;
    private String groupBy;

}
