package com.recursiondev.dashboard.dto.request;

import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.enums.WidgetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class WidgetRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Widget type is required")
    private WidgetType widgetType;

    @NotNull(message = "Dashboard ID is required")
    private Long dashboardId;

    private String datasetId;

    private String groupByField;

    private String metricField;

    private AggregationType aggregationType;

    public WidgetRequest() {
    }

    public WidgetRequest(String title, WidgetType widgetType, Long dashboardId,
                         String datasetId, String groupByField, String metricField,
                         AggregationType aggregationType) {
        this.title = title;
        this.widgetType = widgetType;
        this.dashboardId = dashboardId;
        this.datasetId = datasetId;
        this.groupByField = groupByField;
        this.metricField = metricField;
        this.aggregationType = aggregationType;
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
}
