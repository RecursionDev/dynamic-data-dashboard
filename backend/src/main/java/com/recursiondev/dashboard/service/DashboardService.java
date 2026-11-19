
package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.request.DashboardRequest;
import com.recursiondev.dashboard.dto.response.DashboardResponse;
import com.recursiondev.dashboard.entity.Dashboard;
import com.recursiondev.dashboard.repository.DashboardRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    public DashboardResponse createDashboard(DashboardRequest request) {

        Dashboard dashboard = new Dashboard(
                request.title(),
                request.description()
        );

        Dashboard savedDashboard = dashboardRepository.save(dashboard);

        return mapToResponse(savedDashboard);
    }

    public List<DashboardResponse> getAllDashboards() {

        return dashboardRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public DashboardResponse getDashboardById(Long id) {

        Dashboard dashboard = dashboardRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Dashboard not found"));

        return mapToResponse(dashboard);
    }

    public DashboardResponse updateDashboard(
            Long id, DashboardRequest request) {

        Dashboard existingDashboard = dashboardRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Dashboard not found"));

        existingDashboard.setTitle(request.title());
        existingDashboard.setDescription(request.description());

        Dashboard updatedDashboard =
                dashboardRepository.save(existingDashboard);

        return mapToResponse(updatedDashboard);
    }

    public void deleteDashboard(Long id) {
        dashboardRepository.deleteById(id);
    }

    private DashboardResponse mapToResponse(Dashboard dashboard) {

        return new DashboardResponse(
                dashboard.getId(),
                dashboard.getTitle(),
                dashboard.getDescription(),
                dashboard.getCreatedAt()
        );
    }
}
