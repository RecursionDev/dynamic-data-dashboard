package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.response.UserResponse;
import com.recursiondev.dashboard.entity.User;
import com.recursiondev.dashboard.enums.Role;
import com.recursiondev.dashboard.exception.ResourceNotFoundException;
import com.recursiondev.dashboard.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private UserService userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(10L);
        sampleUser.setName("Alice Smith");
        sampleUser.setUsername("alice");
        sampleUser.setEmail("alice@example.com");
        sampleUser.setPassword("hashedPass");
        sampleUser.setRole(Role.ROLE_USER);
    }

    @Test
    @DisplayName("Should return current user profile from SecurityContext")
    void testGetCurrentUserProfile() {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken("alice@example.com", null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(sampleUser));

        UserResponse response = userService.getCurrentUserProfile();

        assertNotNull(response);
        assertEquals(10L, response.id());
        assertEquals("Alice Smith", response.name());
        assertEquals("alice@example.com", response.email());
        assertEquals(Role.ROLE_USER, response.role());
    }

    @Test
    @DisplayName("Should return all users list")
    void testGetAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(sampleUser));

        List<UserResponse> list = userService.getAllUsers();

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("alice@example.com", list.get(0).email());
    }

    @Test
    @DisplayName("Should return user by ID")
    void testGetUserById() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(sampleUser));

        UserResponse response = userService.getUserById(10L);

        assertNotNull(response);
        assertEquals(10L, response.id());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when user ID does not exist")
    void testGetUserByIdNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(999L));
    }
}
