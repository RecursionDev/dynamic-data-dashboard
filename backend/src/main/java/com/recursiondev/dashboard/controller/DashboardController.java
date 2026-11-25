package com.recursiondev.dashboard.controller;

import com.recursiondev.dashboard.entity.Dashboard;
import com.recursiondev.dashboard.service.DashboardService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    @PutMapping("/{id}")
    public Dashboard updateDashboard(
            @PathVariable Long id,
            @RequestBody Dashboard dashboard) {

        return dashboardService.updateDashboard(id, dashboard);
    }
    @GetMapping("/search")
    public List<Dashboard> searchDashboards(@RequestParam String title) {
        return dashboardService.searchDashboard(title);
    }

    @GetMapping("/paged")
    public Page<Dashboard> getPagedDashboards(
            Pageable pageable) {

        return dashboardService
                .getPagedDashboards(pageable);
    }
    @GetMapping("/sorted")
    public List<Dashboard> getSortedDashboards() {

        return dashboardService.getSortedDashboards();
    }
}