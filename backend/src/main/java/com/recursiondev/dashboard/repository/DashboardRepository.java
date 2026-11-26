package com.recursiondev.dashboard.repository;


import com.recursiondev.dashboard.entity.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DashboardRepository
        extends JpaRepository<Dashboard, Long> {
    List<Dashboard> findByTitleContainingIgnoreCase(String title);
}
