package com.recursiondev.dashboard.controller;

import com.recursiondev.dashboard.entity.Dashboard;
import com.recursiondev.dashboard.service.DashboardService;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import io.swagger.v3.oas.annotations.Operation;


import java.util.List;

@RestController
@RequestMapping("/api/dashboards")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
    @Operation(summary = "Create a new dashboard")
    @PostMapping
    public Dashboard createDashboard(
            @RequestBody Dashboard dashboard) {
        return dashboardService.createDashboard(dashboard);
    }
    @Operation(summary = "Get all dashboard")
    @GetMapping
    public List<Dashboard> getAllDashboards() {
        return dashboardService.getAllDashboards();
    }
    @Operation(summary = "Get dashboard by id")
    @GetMapping("/{id}")
    public Dashboard getDashboardById(
            @PathVariable Long id) {
        return dashboardService.getDashboardById(id);
    }
    @Operation(summary = "Delete dashboard by id")
    @DeleteMapping("/{id}")
    public void deleteDashboard(
            @PathVariable Long id) {
        dashboardService.deleteDashboard(id);
    }
    @Operation(summary = "Update dashboard by id")
    @PutMapping("/{id}")
    public Dashboard updateDashboard(
            @PathVariable Long id,
            @RequestBody Dashboard dashboard) {

        return dashboardService.updateDashboard(id, dashboard);
    }
    @Operation(summary = "Summary dashboards by title")
    @GetMapping("/search")
    public List<Dashboard> searchDashboards(@RequestParam String title) {
        return dashboardService.searchDashboard(title);
    }
    @Operation(summary = "Get paginated dashboards")
    @GetMapping("/paged")
    public Page<Dashboard> getPagedDashboards(
            Pageable pageable) {

        return dashboardService
                .getPagedDashboards(pageable);
    }
    @Operation(summary = "Get all dashboard sorted by title")
    @GetMapping("/sorted")
    public List<Dashboard> getSortedDashboards() {

        return dashboardService.getSortedDashboards();
    }
}