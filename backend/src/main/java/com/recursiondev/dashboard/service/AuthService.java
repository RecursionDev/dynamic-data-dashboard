package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.request.*;
import com.recursiondev.dashboard.dto.response.*;
import com.recursiondev.dashboard.entity.User;
import com.recursiondev.dashboard.repository.UserRepository;
import com.recursiondev.dashboard.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.username());
        user.setEmail(request.email());
        user.setPassword(
                passwordEncoder.encode(request.password())
        );

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                "Registration successful",
                token,
                "Bearer"
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword()
        )) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                "Login successful",
                token,
                "Bearer"
        );
    }
}