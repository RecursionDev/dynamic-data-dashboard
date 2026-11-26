
package com.recursiondev.dashboard.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.recursiondev.dashboard.entity.Dashboard;
import com.recursiondev.dashboard.service.DashboardService;

@RestController
@RequestMapping("/api/dashboards")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PostMapping("/workspace/{workspaceId}")
    public Dashboard createDashboard(
            @PathVariable Long workspaceId,
            @RequestBody Dashboard dashboard,
            Authentication authentication) {

        return dashboardService.createDashboard(
                dashboard,
                workspaceId,
                authentication.getName());
    }

    @GetMapping("/workspace/{workspaceId}")
    public List<Dashboard> getAllDashboards(
            @PathVariable Long workspaceId,
            Authentication authentication) {

        return dashboardService.getAllDashboards(
                workspaceId,
                authentication.getName());
    }

    @GetMapping("/{id}")
    public Dashboard getDashboardById(
            @PathVariable Long id,
            Authentication authentication) {

        return dashboardService.getDashboardById(
                id,
                authentication.getName());
    }

    @PutMapping("/{id}")
    public Dashboard updateDashboard(
            @PathVariable Long id,
            @RequestBody Dashboard dashboard,
            Authentication authentication) {

        return dashboardService.updateDashboard(
                id,
                dashboard,
                authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteDashboard(
            @PathVariable Long id,
            Authentication authentication) {

        dashboardService.deleteDashboard(
                id,
                authentication.getName());
    }
}
