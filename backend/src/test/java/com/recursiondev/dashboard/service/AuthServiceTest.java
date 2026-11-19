package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.request.LoginRequest;
import com.recursiondev.dashboard.dto.request.SignupRequest;
import com.recursiondev.dashboard.dto.response.AuthResponse;
import com.recursiondev.dashboard.entity.User;
import com.recursiondev.dashboard.repository.UserRepository;
import com.recursiondev.dashboard.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("John Doe");
        sampleUser.setEmail("john@example.com");
        sampleUser.setPassword("encodedPassword123");
    }

    @Test
    @DisplayName("Signup: Should register a new user and return JWT token")
    void testSignupSuccess() {
        SignupRequest request = new SignupRequest("John Doe", "john@example.com", "Password@123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedPassword123");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtService.generateToken("john@example.com")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.signup(request);

        assertNotNull(response);
        assertEquals("Registration successful", response.message());
        assertEquals("mock-jwt-token", response.token());
        assertEquals("Bearer", response.tokenType());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Signup: Should throw exception when email is already registered")
    void testSignupDuplicateEmailThrowsException() {
        SignupRequest request = new SignupRequest("John Doe", "john@example.com", "Password@123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.signup(request)
        );

        assertEquals("Email already registered", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Login: Should authenticate user with valid credentials and return JWT token")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("john@example.com", "Password@123");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("Password@123", "encodedPassword123")).thenReturn(true);
        when(jwtService.generateToken("john@example.com")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("Login successful", response.message());
        assertEquals("mock-jwt-token", response.token());
        assertEquals("Bearer", response.tokenType());
    }

    @Test
    @DisplayName("Login: Should throw exception when password is incorrect")
    void testLoginInvalidPasswordThrowsException() {
        LoginRequest request = new LoginRequest("john@example.com", "WrongPassword");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword", "encodedPassword123")).thenReturn(false);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
        );

        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    @DisplayName("Login: Should throw exception when user email is not found")
    void testLoginUserNotFoundThrowsException() {
        LoginRequest request = new LoginRequest("unknown@example.com", "Password@123");

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.login(request)
        );

        assertEquals("Invalid email or password", exception.getMessage());
    }
}
