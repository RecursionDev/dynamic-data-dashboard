package com.recursiondev.dashboard.controller;

import com.recursiondev.dashboard.dto.request.WidgetRequest;
import com.recursiondev.dashboard.dto.response.ApiResponse;
import com.recursiondev.dashboard.dto.response.WidgetResponse;
import com.recursiondev.dashboard.service.WidgetConfigService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/widgets")
public class WidgetController {

    private final WidgetConfigService widgetService;

    public WidgetController(WidgetConfigService widgetService) {
        this.widgetService = widgetService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WidgetResponse>> createWidget(
            @Valid @RequestBody WidgetRequest request
    ) {
        WidgetResponse response = widgetService.createWidget(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Widget created successfully", response));
    }

    @GetMapping("/dashboard/{dashboardId}")
    public ResponseEntity<ApiResponse<List<WidgetResponse>>> getWidgetsByDashboard(
            @PathVariable Long dashboardId
    ) {
        List<WidgetResponse> responses = widgetService.getWidgetsByDashboardId(dashboardId);
        return ResponseEntity.ok(ApiResponse.success("Widgets retrieved successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WidgetResponse>> getWidgetById(
            @PathVariable Long id
    ) {
        WidgetResponse response = widgetService.getWidgetById(id);
        return ResponseEntity.ok(ApiResponse.success("Widget retrieved successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WidgetResponse>> updateWidget(
            @PathVariable Long id,
            @Valid @RequestBody WidgetRequest request
    ) {
        WidgetResponse response = widgetService.updateWidget(id, request);
        return ResponseEntity.ok(ApiResponse.success("Widget updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWidget(
            @PathVariable Long id
    ) {
        widgetService.deleteWidget(id);
        return ResponseEntity.ok(ApiResponse.success("Widget deleted successfully", null));
    }
}
