package com.recursiondev.dashboard.repository;

import com.recursiondev.dashboard.entity.WidgetConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WidgetConfigRepository extends JpaRepository<WidgetConfig, Long> {

    List<WidgetConfig> findByDashboardId(Long dashboardId);

    long countByDashboardId(Long dashboardId);

    void deleteByDashboardId(Long dashboardId);
}
