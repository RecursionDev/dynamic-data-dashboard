package com.recursiondev.dashboard.controller;

import com.recursiondev.dashboard.dto.response.UserResponse;
import com.recursiondev.dashboard.enums.Role;
import com.recursiondev.dashboard.exception.GlobalExceptionHandler;
import com.recursiondev.dashboard.exception.ResourceNotFoundException;
import com.recursiondev.dashboard.service.UserService;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private UserResponse sampleUserResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(userController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        sampleUserResponse = new UserResponse(
                1L,
                "Bob Marley",
                "bob",
                "bob@example.com",
                Role.ROLE_USER,
                LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("GET /api/users/me: Should return current user profile")
    void testGetCurrentUser() throws Exception {
        when(userService.getCurrentUserProfile()).thenReturn(sampleUserResponse);

        mockMvc.perform(get("/api/users/me").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Bob Marley"))
                .andExpect(jsonPath("$.email").value("bob@example.com"));
    }

    @Test
    @DisplayName("GET /api/users: Should return list of all users")
    void testGetAllUsers() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(sampleUserResponse));

        mockMvc.perform(get("/api/users").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].email").value("bob@example.com"));
    }

    @Test
    @DisplayName("GET /api/users/{id}: Should return user details for existing id")
    void testGetUserById() throws Exception {
        when(userService.getUserById(1L)).thenReturn(sampleUserResponse);

        mockMvc.perform(get("/api/users/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Bob Marley"));
    }

    @Test
    @DisplayName("GET /api/users/{id}: Should return 404 Not Found when user does not exist")
    void testGetUserByIdNotFound() throws Exception {
        when(userService.getUserById(99L)).thenThrow(new ResourceNotFoundException("User not found with id: 99"));

        mockMvc.perform(get("/api/users/99").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("User not found with id: 99"));
    }
}
