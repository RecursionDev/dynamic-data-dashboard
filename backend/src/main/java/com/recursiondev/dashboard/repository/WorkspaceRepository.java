package com.recursiondev.dashboard.repository;

import com.recursiondev.dashboard.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

}