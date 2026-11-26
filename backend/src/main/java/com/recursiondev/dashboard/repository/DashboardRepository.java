
package com.recursiondev.dashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recursiondev.dashboard.entity.Dashboard;

public interface DashboardRepository
        extends JpaRepository<Dashboard, Long> {

    List<Dashboard> findByWorkspaceIdAndWorkspaceOwnerEmail(
            Long workspaceId, String email);

    Optional<Dashboard> findByIdAndWorkspaceOwnerEmail(
            Long id, String email);
}
