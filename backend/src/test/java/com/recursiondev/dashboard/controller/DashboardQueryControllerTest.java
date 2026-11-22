package com.recursiondev.dashboard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recursiondev.dashboard.dto.request.DashboardQueryRequest;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.exception.BadRequestException;
import com.recursiondev.dashboard.exception.GlobalExceptionHandler;
import com.recursiondev.dashboard.service.DashboardQueryService;
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

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class DashboardQueryControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private DashboardQueryService queryService;

    @InjectMocks
    private DashboardQueryController queryController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(queryController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/dashboards/query: Success returns 200 with metrics")
    void testExecuteQuerySuccess() throws Exception {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setGroupByField("dimension");
        request.setMetricField("metricValue");
        request.setAggregationType(AggregationType.SUM);

        List<MetricResult> mockResults = List.of(
                new MetricResult("Electronics", 2000.0, 2L),
                new MetricResult("Clothing", 1000.0, 2L)
        );

        when(queryService.executeQuery(any(DashboardQueryRequest.class))).thenReturn(mockResults);

        mockMvc.perform(post("/api/dashboards/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].groupKey").value("Electronics"))
                .andExpect(jsonPath("$[0].value").value(2000.0))
                .andExpect(jsonPath("$[0].count").value(2));
    }

    @Test
    @DisplayName("POST /api/dashboards/query: Missing datasetId returns 400 Validation Error")
    void testExecuteQueryMissingDatasetId() throws Exception {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setAggregationType(AggregationType.SUM);

        mockMvc.perform(post("/api/dashboards/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"));
    }

    @Test
    @DisplayName("POST /api/dashboards/query: Disallowed field returns 400 Bad Request")
    void testExecuteQueryDisallowedField() throws Exception {
        DashboardQueryRequest request = new DashboardQueryRequest();
        request.setDatasetId("sales-2024");
        request.setGroupByField("unauthorized_field");
        request.setAggregationType(AggregationType.SUM);

        when(queryService.executeQuery(any(DashboardQueryRequest.class)))
                .thenThrow(new BadRequestException("Invalid groupByField: 'unauthorized_field'"));

        mockMvc.perform(post("/api/dashboards/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Invalid groupByField: 'unauthorized_field'"));
    }

    @Test
    @DisplayName("GET /api/dashboards/query/allowed-fields: Returns allowed schema")
    void testGetAllowedFields() throws Exception {
        Map<String, Object> mockSchema = new LinkedHashMap<>();
        mockSchema.put("allowedGroupFields", List.of("dimension", "metricName"));

        when(queryService.getAllowedFields()).thenReturn(mockSchema);

        mockMvc.perform(get("/api/dashboards/query/allowed-fields"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.allowedGroupFields[0]").value("dimension"));
    }
}
