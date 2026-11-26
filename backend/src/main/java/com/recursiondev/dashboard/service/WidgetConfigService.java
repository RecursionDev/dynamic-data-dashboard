package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.request.WidgetRequest;
import com.recursiondev.dashboard.dto.response.WidgetResponse;
import com.recursiondev.dashboard.entity.WidgetConfig;
import com.recursiondev.dashboard.exception.ResourceNotFoundException;
import com.recursiondev.dashboard.repository.WidgetConfigRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WidgetConfigService {

    private final WidgetConfigRepository widgetRepository;

    public WidgetConfigService(WidgetConfigRepository widgetRepository) {
        this.widgetRepository = widgetRepository;
    }

    public WidgetResponse createWidget(WidgetRequest request) {
        WidgetConfig entity = toEntity(request);
        WidgetConfig saved = widgetRepository.save(entity);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<WidgetResponse> getWidgetsByDashboardId(Long dashboardId) {
        return widgetRepository.findByDashboardId(dashboardId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WidgetResponse getWidgetById(Long id) {
        WidgetConfig entity = widgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Widget not found with ID: " + id));
        return toResponse(entity);
    }

    public WidgetResponse updateWidget(Long id, WidgetRequest request) {
        WidgetConfig entity = widgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Widget not found with ID: " + id));

        entity.setTitle(request.getTitle());
        entity.setWidgetType(request.getWidgetType());
        entity.setDashboardId(request.getDashboardId());
        entity.setDatasetId(request.getDatasetId());
        entity.setGroupByField(request.getGroupByField());
        entity.setMetricField(request.getMetricField());
        entity.setAggregationType(request.getAggregationType());

        WidgetConfig updated = widgetRepository.save(entity);
        return toResponse(updated);
    }

    public void deleteWidget(Long id) {
        if (!widgetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Widget not found with ID: " + id);
        }
        widgetRepository.deleteById(id);
    }

    private WidgetConfig toEntity(WidgetRequest req) {
        WidgetConfig entity = new WidgetConfig();
        entity.setTitle(req.getTitle());
        entity.setWidgetType(req.getWidgetType());
        entity.setDashboardId(req.getDashboardId());
        entity.setDatasetId(req.getDatasetId());
        entity.setGroupByField(req.getGroupByField());
        entity.setMetricField(req.getMetricField());
        entity.setAggregationType(req.getAggregationType());
        return entity;
    }

    private WidgetResponse toResponse(WidgetConfig entity) {
        return new WidgetResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getWidgetType(),
                entity.getDashboardId(),
                entity.getDatasetId(),
                entity.getGroupByField(),
                entity.getMetricField(),
                entity.getAggregationType(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
