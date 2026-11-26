package com.recursiondev.dashboard.service;



import com.recursiondev.dashboard.entity.Dashboard;
import com.recursiondev.dashboard.repository.DashboardRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;


import java.util.List;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    public Dashboard createDashboard(Dashboard dashboard) {
        return dashboardRepository.save(dashboard);
    }

    public List<Dashboard> getAllDashboards() {
        return dashboardRepository.findAll();
    }

    public Dashboard getDashboardById(Long id) {
        return dashboardRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Dashboard not found"));
    }

    public void deleteDashboard(Long id) {
        dashboardRepository.deleteById(id);
    }
    public Dashboard updateDashboard(
            Long id,
            Dashboard updatedDashboard) {

        Dashboard dashboard = dashboardRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Dashboard not found"));

        dashboard.setTitle(updatedDashboard.getTitle());
        dashboard.setDescription(updatedDashboard.getDescription());

        return dashboardRepository.save(dashboard);
    }
    public List<Dashboard> searchDashboard(String title){
        return dashboardRepository.findByTitleContainingIgnoreCase(title);
    }
    public Page<Dashboard> getPagedDashboards(Pageable pageable) {
        return dashboardRepository.findAll(pageable);
    }
    @GetMapping("/sorted")
    public List<Dashboard> getSortedDashboards() {
        return dashboardRepository.findAll(
                Sort.by("title"));
    }
}