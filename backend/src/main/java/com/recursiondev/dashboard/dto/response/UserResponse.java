package com.recursiondev.dashboard.dto.response;

import com.recursiondev.dashboard.entity.User;
import com.recursiondev.dashboard.enums.Role;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String username,
        String email,
        Role role,
        LocalDateTime createdAt
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
