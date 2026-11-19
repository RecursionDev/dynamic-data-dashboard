package com.recursiondev.dashboard.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String testSecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", testSecret);
    }

    @Test
    @DisplayName("Should generate token and extract subject email correctly")
    void testGenerateTokenAndExtractEmail() {
        String email = "developer@axlero.com";

        String token = jwtService.generateToken(email);

        assertNotNull(token);
        assertFalse(token.isBlank());

        String extracted = jwtService.extractEmail(token);
        assertEquals(email, extracted);
    }

    @Test
    @DisplayName("Should validate genuine token as true")
    void testIsTokenValid() {
        String token = jwtService.generateToken("user@example.com");

        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    @DisplayName("Should report malformed or tampered token as invalid")
    void testInvalidToken() {
        assertFalse(jwtService.isTokenValid("invalid.token.signature"));
    }
}
