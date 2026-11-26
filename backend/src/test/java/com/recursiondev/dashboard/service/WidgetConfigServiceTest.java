package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.request.WidgetRequest;
import com.recursiondev.dashboard.dto.response.WidgetResponse;
import com.recursiondev.dashboard.entity.WidgetConfig;
import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.enums.WidgetType;
import com.recursiondev.dashboard.exception.ResourceNotFoundException;
import com.recursiondev.dashboard.repository.WidgetConfigRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WidgetConfigServiceTest {

    @Mock
    private WidgetConfigRepository widgetRepository;

    @InjectMocks
    private WidgetConfigService widgetService;

    private WidgetConfig sampleWidget;
    private WidgetRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleWidget = new WidgetConfig(
                1L,
                "Revenue by Category",
                WidgetType.BAR_CHART,
                10L,
                "sales-data",
                "dimension",
                "metricValue",
                AggregationType.SUM
        );

        sampleRequest = new WidgetRequest(
                "Revenue by Category",
                WidgetType.BAR_CHART,
                10L,
                "sales-data",
                "dimension",
                "metricValue",
                AggregationType.SUM
        );
    }

    @Test
    @DisplayName("createWidget persists and maps response")
    void testCreateWidget() {
        when(widgetRepository.save(any(WidgetConfig.class))).thenReturn(sampleWidget);

        WidgetResponse response = widgetService.createWidget(sampleRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Revenue by Category", response.getTitle());
        assertEquals(WidgetType.BAR_CHART, response.getWidgetType());
        assertEquals(10L, response.getDashboardId());
    }

    @Test
    @DisplayName("getWidgetsByDashboardId returns widgets list")
    void testGetWidgetsByDashboardId() {
        when(widgetRepository.findByDashboardId(10L)).thenReturn(List.of(sampleWidget));

        List<WidgetResponse> responses = widgetService.getWidgetsByDashboardId(10L);

        assertEquals(1, responses.size());
        assertEquals("Revenue by Category", responses.get(0).getTitle());
    }

    @Test
    @DisplayName("getWidgetById returns widget when found")
    void testGetWidgetByIdFound() {
        when(widgetRepository.findById(1L)).thenReturn(Optional.of(sampleWidget));

        WidgetResponse response = widgetService.getWidgetById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    @DisplayName("getWidgetById throws ResourceNotFoundException when not found")
    void testGetWidgetByIdNotFound() {
        when(widgetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> widgetService.getWidgetById(99L));
    }

    @Test
    @DisplayName("updateWidget updates and returns saved widget")
    void testUpdateWidget() {
        when(widgetRepository.findById(1L)).thenReturn(Optional.of(sampleWidget));
        when(widgetRepository.save(any(WidgetConfig.class))).thenReturn(sampleWidget);

        WidgetRequest updateReq = new WidgetRequest(
                "Updated Title",
                WidgetType.PIE_CHART,
                10L,
                "sales-data",
                "dimension",
                "metricValue",
                AggregationType.AVG
        );

        WidgetResponse response = widgetService.updateWidget(1L, updateReq);

        assertNotNull(response);
        verify(widgetRepository).save(sampleWidget);
    }

    @Test
    @DisplayName("deleteWidget removes existing widget")
    void testDeleteWidget() {
        when(widgetRepository.existsById(1L)).thenReturn(true);

        widgetService.deleteWidget(1L);

        verify(widgetRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteWidget throws ResourceNotFoundException when ID does not exist")
    void testDeleteWidgetNotFound() {
        when(widgetRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> widgetService.deleteWidget(99L));
    }
}
