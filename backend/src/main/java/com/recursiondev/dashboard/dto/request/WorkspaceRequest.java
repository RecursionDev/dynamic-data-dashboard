package com.recursiondev.dashboard.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class WorkspaceRequest {

    @NotBlank(message = "Workspace name is required")
    @Size(max = 100, message = "Workspace name cannot exceed 100 characters")
    private String name;

    private String description;

    public WorkspaceRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}