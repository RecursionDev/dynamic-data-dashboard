package com.recursiondev.dashboard.dto.response;

import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.enums.WidgetType;

import java.time.LocalDateTime;

public class WidgetResponse {

    private Long id;
    private String title;
    private WidgetType widgetType;
    private Long dashboardId;
    private String datasetId;
    private String groupByField;
    private String metricField;
    private AggregationType aggregationType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public WidgetResponse() {
    }

    public WidgetResponse(Long id, String title, WidgetType widgetType, Long dashboardId,
                          String datasetId, String groupByField, String metricField,
                          AggregationType aggregationType, LocalDateTime createdAt,
                          LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.widgetType = widgetType;
        this.dashboardId = dashboardId;
        this.datasetId = datasetId;
        this.groupByField = groupByField;
        this.metricField = metricField;
        this.aggregationType = aggregationType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
