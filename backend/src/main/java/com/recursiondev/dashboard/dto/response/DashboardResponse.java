package com.recursiondev.dashboard.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class DashboardResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // getters setters
}
