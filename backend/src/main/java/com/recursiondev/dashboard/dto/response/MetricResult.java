package com.recursiondev.dashboard.dto.response;

public class MetricResult {

    private String groupKey;
    private Double value;
    private Long count;

    public MetricResult() {
    }

    public MetricResult(String groupKey, Double value) {
        this.groupKey = groupKey;
        this.value = value;
    }

    public MetricResult(String groupKey, Double value, Long count) {
        this.groupKey = groupKey;
        this.value = value;
        this.count = count;
    }

    public String getGroupKey() {
        return groupKey;
    }

    public void setGroupKey(String groupKey) {
        this.groupKey = groupKey;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
