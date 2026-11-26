
package com.recursiondev.dashboard.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.recursiondev.dashboard.entity.Workspace;
import com.recursiondev.dashboard.service.WorkspaceService;
import com.recursiondev.dashboard.dto.request.WorkspaceRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @PostMapping
    public Workspace createWorkspace(
            @Valid @RequestBody WorkspaceRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return workspaceService.createWorkspace(
                request.getName(),
                request.getDescription(),
                email);
    }

    @GetMapping
    public List<Workspace> getAllWorkspaces(Authentication authentication) {

        String email = authentication.getName();

        return workspaceService.getAllWorkspaces(email);
    }

    @GetMapping("/{id}")
    public Workspace getWorkspaceById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        return workspaceService.getWorkspaceById(id, email);
    }
}
