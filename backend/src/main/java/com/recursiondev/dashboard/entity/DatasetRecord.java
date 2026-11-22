package com.recursiondev.dashboard.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dataset_records", indexes = {
        @Index(name = "idx_dataset_records_dataset_id", columnList = "datasetId"),
        @Index(name = "idx_dataset_records_dimension", columnList = "dimension")
})
public class DatasetRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String datasetId;

    @Column(length = 150)
    private String dimension;

    @Column(length = 100)
    private String metricName;

    @Column(nullable = false)
    private Double metricValue;

    @Column(length = 150)
    private String secondaryDimension;

    private LocalDateTime recordDate;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public DatasetRecord() {
    }

    public DatasetRecord(String datasetId, String dimension, String metricName, Double metricValue) {
        this.datasetId = datasetId;
        this.dimension = dimension;
        this.metricName = metricName;
        this.metricValue = metricValue;
    }

    public DatasetRecord(Long id, String datasetId, String dimension, String metricName, Double metricValue,
                         String secondaryDimension, LocalDateTime recordDate) {
        this.id = id;
        this.datasetId = datasetId;
        this.dimension = dimension;
        this.metricName = metricName;
        this.metricValue = metricValue;
        this.secondaryDimension = secondaryDimension;
        this.recordDate = recordDate;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.metricValue == null) {
            this.metricValue = 0.0;
        }
        if (this.metricName == null) {
            this.metricName = "value";
        }
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
