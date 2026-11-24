package com.recursiondev.dashboard.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(

        @NotBlank(message = "Username is required")
        String username,

        @Email(message = "Invalid email")
        @NotBlank(message = "Email is required") String email,

        @Size(min = 8, message = "Password must be at least 8 characters")
        String password

) {}