package com.recursiondev.dashboard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recursiondev.dashboard.dto.request.LoginRequest;
import com.recursiondev.dashboard.dto.request.SignupRequest;
import com.recursiondev.dashboard.dto.response.AuthResponse;
import com.recursiondev.dashboard.exception.GlobalExceptionHandler;
import com.recursiondev.dashboard.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("POST /api/auth/signup: Should return 200 OK and AuthResponse")
    void testSignupEndpoint() throws Exception {
        SignupRequest request = new SignupRequest("Jane Doe", "jane@example.com", "Password@123");
        AuthResponse response = new AuthResponse("Registration successful", "mock-jwt-token", "Bearer");

        when(authService.signup(any(SignupRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Registration successful"))
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    @DisplayName("POST /api/auth/register: Should also accept register alias route")
    void testRegisterAliasEndpoint() throws Exception {
        SignupRequest request = new SignupRequest("Jane Doe", "jane@example.com", "Password@123");
        AuthResponse response = new AuthResponse("Registration successful", "mock-jwt-token", "Bearer");

        when(authService.signup(any(SignupRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Registration successful"))
                .andExpect(jsonPath("$.token").value("mock-jwt-token"));
    }

    @Test
    @DisplayName("POST /api/auth/login: Should return 200 OK and AuthResponse")
    void testLoginEndpoint() throws Exception {
        LoginRequest request = new LoginRequest("jane@example.com", "Password@123");
        AuthResponse response = new AuthResponse("Login successful", "mock-jwt-token", "Bearer");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.token").value("mock-jwt-token"));
    }

    @Test
    @DisplayName("POST /api/auth/login: Should return 400 Bad Request when credentials are invalid")
    void testLoginFailureReturnsBadRequest() throws Exception {
        LoginRequest request = new LoginRequest("jane@example.com", "WrongPassword");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new IllegalArgumentException("Invalid email or password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}
