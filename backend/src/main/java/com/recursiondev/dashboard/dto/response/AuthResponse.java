package com.recursiondev.dashboard.dto.response;

public record AuthResponse(
        String message,
        String token,
        String tokenType
) {}
