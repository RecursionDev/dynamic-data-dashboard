package com.recursiondev.dashboard.dto.response;

import java.time.LocalDateTime;

public class DatasetRecordResponse {

    private Long id;
    private String datasetId;
    private String dimension;
    private String metricName;
    private Double metricValue;
    private String secondaryDimension;
    private LocalDateTime recordDate;
    private LocalDateTime createdAt;

    public DatasetRecordResponse() {
    }

    public DatasetRecordResponse(Long id, String datasetId, String dimension, String metricName,
                                 Double metricValue, String secondaryDimension,
                                 LocalDateTime recordDate, LocalDateTime createdAt) {
        this.id = id;
        this.datasetId = datasetId;
        this.dimension = dimension;
        this.metricName = metricName;
        this.metricValue = metricValue;
        this.secondaryDimension = secondaryDimension;
        this.recordDate = recordDate;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDatasetId() {
        return datasetId;
    }

    public void setDatasetId(String datasetId) {
        this.datasetId = datasetId;
    }

    public String getDimension() {
        return dimension;
    }

    public void setDimension(String dimension) {
        this.dimension = dimension;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public Double getMetricValue() {
        return metricValue;
    }

    public void setMetricValue(Double metricValue) {
        this.metricValue = metricValue;
    }

    public String getSecondaryDimension() {
        return secondaryDimension;
    }

    public void setSecondaryDimension(String secondaryDimension) {
        this.secondaryDimension = secondaryDimension;
    }

    public LocalDateTime getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDateTime recordDate) {
        this.recordDate = recordDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
