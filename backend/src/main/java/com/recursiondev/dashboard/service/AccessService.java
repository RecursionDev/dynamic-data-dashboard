
package com.recursiondev.dashboard.service;

import org.springframework.stereotype.Service;

import com.recursiondev.dashboard.entity.Workspace;
import com.recursiondev.dashboard.repository.WorkspaceRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AccessService {

    private final WorkspaceRepository workspaceRepository;

    public AccessService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    public Workspace verifyWorkspaceAccess(Long workspaceId, String email) {

        return workspaceRepository
                .findByIdAndOwnerEmail(workspaceId, email)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Workspace not found or access denied"));
    }
}
