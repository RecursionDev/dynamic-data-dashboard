package com.recursiondev.dashboard.entity;

import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.enums.WidgetType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "widget_configs", indexes = {
        @Index(name = "idx_widget_dashboard_id", columnList = "dashboardId")
})
public class WidgetConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private WidgetType widgetType;

    @Column(nullable = false)
    private Long dashboardId;

    @Column(length = 100)
    private String datasetId;

    @Column(length = 100)
    private String groupByField;

    @Column(length = 100)
    private String metricField;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AggregationType aggregationType;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public WidgetConfig() {
    }

    public WidgetConfig(Long id, String title, WidgetType widgetType, Long dashboardId,
                        String datasetId, String groupByField, String metricField,
                        AggregationType aggregationType) {
        this.id = id;
        this.title = title;
        this.widgetType = widgetType;
        this.dashboardId = dashboardId;
        this.datasetId = datasetId;
        this.groupByField = groupByField;
        this.metricField = metricField;
        this.aggregationType = aggregationType;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public WidgetType getWidgetType() {
        return widgetType;
    }

    public void setWidgetType(WidgetType widgetType) {
        this.widgetType = widgetType;
    }

    public Long getDashboardId() {
        return dashboardId;
    }

    public void setDashboardId(Long dashboardId) {
        this.dashboardId = dashboardId;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
