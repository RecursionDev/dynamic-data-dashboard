
package com.recursiondev.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.recursiondev.dashboard.entity.Dashboard;
import com.recursiondev.dashboard.entity.Workspace;
import com.recursiondev.dashboard.repository.DashboardRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;
    private final AccessService accessService;

    public DashboardService(
            DashboardRepository dashboardRepository,
            AccessService accessService) {

        this.dashboardRepository = dashboardRepository;
        this.accessService = accessService;
    }

    public Dashboard createDashboard(
            Dashboard dashboard,
            Long workspaceId,
            String email) {

        Workspace workspace =
                accessService.verifyWorkspaceAccess(workspaceId, email);

        dashboard.setWorkspace(workspace);

        return dashboardRepository.save(dashboard);
    }

    public List<Dashboard> getAllDashboards(
            Long workspaceId,
            String email) {

        accessService.verifyWorkspaceAccess(workspaceId, email);

        return dashboardRepository
                .findByWorkspaceIdAndWorkspaceOwnerEmail(workspaceId, email);
    }

    public Dashboard getDashboardById(Long id, String email) {

        return dashboardRepository
                .findByIdAndWorkspaceOwnerEmail(id, email)
                .orElseThrow(() ->
                        new EntityNotFoundException("Dashboard not found"));
    }

    public void deleteDashboard(Long id, String email) {

        Dashboard dashboard = getDashboardById(id, email);

        dashboardRepository.delete(dashboard);
    }

    @Transactional
    public Dashboard updateDashboard(
            Long id,
            Dashboard updatedDashboard,
            String email) {

        Dashboard dashboard = getDashboardById(id, email);

        dashboard.setTitle(updatedDashboard.getTitle());
        dashboard.setDescription(updatedDashboard.getDescription());

        return dashboardRepository.save(dashboard);
    }
}
