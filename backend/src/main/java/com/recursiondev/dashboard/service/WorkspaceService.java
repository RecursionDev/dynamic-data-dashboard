package com.recursiondev.dashboard.service;

import org.springframework.stereotype.Service;

import com.recursiondev.dashboard.entity.User;
import com.recursiondev.dashboard.entity.Workspace;
import com.recursiondev.dashboard.repository.WorkspaceRepository;
import com.recursiondev.dashboard.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    public WorkspaceService(
            WorkspaceRepository workspaceRepository,
            UserRepository userRepository) {

        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
    }

    public Workspace createWorkspace(
            String name,
            String description,
            String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found"));

        Workspace workspace = new Workspace();
        workspace.setName(name);
        workspace.setDescription(description);
        workspace.setOwner(owner);

        return workspaceRepository.save(workspace);
    }
}