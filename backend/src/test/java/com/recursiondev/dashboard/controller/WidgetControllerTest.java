package com.recursiondev.dashboard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recursiondev.dashboard.dto.request.WidgetRequest;
import com.recursiondev.dashboard.dto.response.WidgetResponse;
import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.enums.WidgetType;
import com.recursiondev.dashboard.exception.GlobalExceptionHandler;
import com.recursiondev.dashboard.exception.ResourceNotFoundException;
import com.recursiondev.dashboard.service.WidgetConfigService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class WidgetControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private WidgetConfigService widgetService;

    @InjectMocks
    private WidgetController widgetController;

    private WidgetResponse sampleResponse;
    private WidgetRequest sampleRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(widgetController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        sampleResponse = new WidgetResponse(
                1L,
                "Total Revenue KPI",
                WidgetType.KPI_CARD,
                5L,
                "ds-01",
                "dimension",
                "metricValue",
                AggregationType.SUM,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        sampleRequest = new WidgetRequest(
                "Total Revenue KPI",
                WidgetType.KPI_CARD,
                5L,
                "ds-01",
                "dimension",
                "metricValue",
                AggregationType.SUM
        );
    }

    @Test
    @DisplayName("POST /api/widgets: Success returns 201 Created")
    void testCreateWidget() throws Exception {
        when(widgetService.createWidget(any(WidgetRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/widgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("Total Revenue KPI"));
    }

    @Test
    @DisplayName("GET /api/widgets/dashboard/{dashboardId}: Returns widgets list")
    void testGetWidgetsByDashboard() throws Exception {
        when(widgetService.getWidgetsByDashboardId(5L)).thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/widgets/dashboard/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.length()").value(1));
    }

    @Test
    @DisplayName("GET /api/widgets/{id}: Returns 200 with widget")
    void testGetWidgetById() throws Exception {
        when(widgetService.getWidgetById(1L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/widgets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("GET /api/widgets/{id}: Not found returns 404")
    void testGetWidgetByIdNotFound() throws Exception {
        when(widgetService.getWidgetById(99L))
                .thenThrow(new ResourceNotFoundException("Widget not found with ID: 99"));

        mockMvc.perform(get("/api/widgets/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    @DisplayName("DELETE /api/widgets/{id}: Returns 200 OK")
    void testDeleteWidget() throws Exception {
        doNothing().when(widgetService).deleteWidget(1L);

        mockMvc.perform(delete("/api/widgets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
