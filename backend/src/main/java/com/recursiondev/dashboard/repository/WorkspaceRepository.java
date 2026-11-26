package com.recursiondev.dashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recursiondev.dashboard.entity.Workspace;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    List<Workspace> findByOwnerEmail(String email);

    Optional<Workspace> findByIdAndOwnerEmail(Long id, String email);
}