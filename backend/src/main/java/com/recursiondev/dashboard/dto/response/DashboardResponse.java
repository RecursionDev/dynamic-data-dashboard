
package com.recursiondev.dashboard.dto.response;

import java.time.LocalDateTime;

public record DashboardResponse(
        Long id,
        String title,
        String description,
        LocalDateTime createdAt
) {
}
