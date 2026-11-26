package com.recursiondev.dashboard.repository;


import com.recursiondev.dashboard.entity.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DashboardRepository
        extends JpaRepository<Dashboard, Long> {
}
