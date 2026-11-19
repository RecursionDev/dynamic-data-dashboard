package com.recursiondev.dashboard.controller;

import com.recursiondev.dashboard.entity.Dashboard;
import com.recursiondev.dashboard.service.DashboardService;
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
    public Dashboard createDashboard(
            @RequestBody Dashboard dashboard) {
        return dashboardService.createDashboard(dashboard);
    }

    @GetMapping
    public List<Dashboard> getAllDashboards() {
        return dashboardService.getAllDashboards();
    }

    @GetMapping("/{id}")
    public Dashboard getDashboardById(
            @PathVariable Long id) {
        return dashboardService.getDashboardById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteDashboard(
            @PathVariable Long id) {
        dashboardService.deleteDashboard(id);
    }
}