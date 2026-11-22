package com.recursiondev.dashboard.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DatasetRecordRequest {

    @NotBlank(message = "datasetId is required")
    private String datasetId;

    private String dimension;

    private String metricName;

    @NotNull(message = "metricValue is required")
    private Double metricValue;

    private String secondaryDimension;

    private LocalDateTime recordDate;

    public DatasetRecordRequest() {
    }

    public DatasetRecordRequest(String datasetId, String dimension, String metricName, Double metricValue) {
        this.datasetId = datasetId;
        this.dimension = dimension;
        this.metricName = metricName;
        this.metricValue = metricValue;
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
}
