package com.recursiondev.dashboard.dto.request;

import com.recursiondev.dashboard.enums.AggregationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DashboardQueryRequest {

    @NotBlank(message = "datasetId is required")
    private String datasetId;

    private String groupByField;

    private String metricField;

    @NotNull(message = "aggregationType is required")
    private AggregationType aggregationType;

    private String filterField;

    private String filterValue;

    private Double minMetricValue;

    private Double maxMetricValue;

    private String sortOrder;

    private Integer limit;

    public DashboardQueryRequest() {
    }

    public DashboardQueryRequest(String datasetId, String groupByField, String metricField,
                                 AggregationType aggregationType) {
        this.datasetId = datasetId;
        this.groupByField = groupByField;
        this.metricField = metricField;
        this.aggregationType = aggregationType;
    }

    public String getDatasetId() {
        return datasetId;
    }

    public void setDatasetId(String datasetId) {
        this.datasetId = datasetId;
    }

    public String getGroupByField() {
        return groupByField;
    }

    public void setGroupByField(String groupByField) {
        this.groupByField = groupByField;
    }

    public String getMetricField() {
        return metricField;
    }

    public void setMetricField(String metricField) {
        this.metricField = metricField;
    }

    public AggregationType getAggregationType() {
        return aggregationType;
    }

    public void setAggregationType(AggregationType aggregationType) {
        this.aggregationType = aggregationType;
    }

    public String getFilterField() {
        return filterField;
    }

    public void setFilterField(String filterField) {
        this.filterField = filterField;
    }

    public String getFilterValue() {
        return filterValue;
    }

    public void setFilterValue(String filterValue) {
        this.filterValue = filterValue;
    }

    public Double getMinMetricValue() {
        return minMetricValue;
    }

    public void setMinMetricValue(Double minMetricValue) {
        this.minMetricValue = minMetricValue;
    }

    public Double getMaxMetricValue() {
        return maxMetricValue;
    }

    public void setMaxMetricValue(Double maxMetricValue) {
        this.maxMetricValue = maxMetricValue;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }
}
