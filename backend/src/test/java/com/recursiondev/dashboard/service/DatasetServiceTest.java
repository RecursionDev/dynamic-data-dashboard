package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.request.DatasetRecordRequest;
import com.recursiondev.dashboard.dto.response.DatasetRecordResponse;
import com.recursiondev.dashboard.entity.DatasetRecord;
import com.recursiondev.dashboard.repository.DatasetRecordRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DatasetServiceTest {

    @Mock
    private DatasetRecordRepository recordRepository;

    @InjectMocks
    private DatasetService datasetService;

    @Test
    @DisplayName("createRecord persists and maps entity to response")
    void testCreateRecord() {
        DatasetRecordRequest request = new DatasetRecordRequest("ds-1", "Books", "revenue", 50.0);
        DatasetRecord savedEntity = new DatasetRecord(1L, "ds-1", "Books", "revenue", 50.0, null, null);

        when(recordRepository.save(any(DatasetRecord.class))).thenReturn(savedEntity);

        DatasetRecordResponse response = datasetService.createRecord(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("ds-1", response.getDatasetId());
        assertEquals("Books", response.getDimension());
        assertEquals(50.0, response.getMetricValue());
    }

    @Test
    @DisplayName("createRecordsBulk saves all items")
    void testCreateRecordsBulk() {
        List<DatasetRecordRequest> requests = List.of(
                new DatasetRecordRequest("ds-1", "A", "val", 10.0),
                new DatasetRecordRequest("ds-1", "B", "val", 20.0)
        );
        List<DatasetRecord> saved = List.of(
                new DatasetRecord(1L, "ds-1", "A", "val", 10.0, null, null),
                new DatasetRecord(2L, "ds-1", "B", "val", 20.0, null, null)
        );

        when(recordRepository.saveAll(anyList())).thenReturn(saved);

        List<DatasetRecordResponse> responses = datasetService.createRecordsBulk(requests);

        assertEquals(2, responses.size());
        verify(recordRepository, times(1)).saveAll(anyList());
    }

    @Test
    @DisplayName("getRecordsByDatasetId returns mapped list")
    void testGetRecordsByDatasetId() {
        when(recordRepository.findByDatasetId("ds-1")).thenReturn(List.of(
                new DatasetRecord(1L, "ds-1", "A", "val", 10.0, null, null)
        ));

        List<DatasetRecordResponse> responses = datasetService.getRecordsByDatasetId("ds-1");

        assertEquals(1, responses.size());
        assertEquals("ds-1", responses.get(0).getDatasetId());
    }

    @Test
    @DisplayName("countRecords returns count from repository")
    void testCountRecords() {
        when(recordRepository.countByDatasetId("ds-1")).thenReturn(42L);

        long count = datasetService.countRecords("ds-1");

        assertEquals(42L, count);
    }

    @Test
    @DisplayName("deleteDataset triggers deletion")
    void testDeleteDataset() {
        datasetService.deleteDataset("ds-1");
        verify(recordRepository, times(1)).deleteByDatasetId("ds-1");
    }
}
