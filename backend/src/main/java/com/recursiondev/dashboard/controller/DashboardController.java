
package com.recursiondev.dashboard.controller;

import com.recursiondev.dashboard.dto.request.DashboardRequest;
import com.recursiondev.dashboard.dto.response.DashboardResponse;
import com.recursiondev.dashboard.service.DashboardService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboards")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PostMapping
    public ResponseEntity<DashboardResponse> createDashboard(
            @Valid @RequestBody DashboardRequest request) {

        return ResponseEntity.ok(
                dashboardService.createDashboard(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<DashboardResponse>> getAllDashboards() {

        return ResponseEntity.ok(
                dashboardService.getAllDashboards()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DashboardResponse> getDashboardById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                dashboardService.getDashboardById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<DashboardResponse> updateDashboard(
            @PathVariable Long id,
            @Valid @RequestBody DashboardRequest request) {

        return ResponseEntity.ok(
                dashboardService.updateDashboard(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDashboard(
            @PathVariable Long id) {

        dashboardService.deleteDashboard(id);

        return ResponseEntity.noContent().build();
    }
}
