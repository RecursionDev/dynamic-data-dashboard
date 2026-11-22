package com.recursiondev.dashboard.controller;

import com.recursiondev.dashboard.dto.request.DatasetRecordRequest;
import com.recursiondev.dashboard.dto.response.ApiResponse;
import com.recursiondev.dashboard.dto.response.DatasetRecordResponse;
import com.recursiondev.dashboard.service.DatasetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/datasets")
public class DatasetController {

    private final DatasetService datasetService;

    public DatasetController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @PostMapping("/records")
    public ResponseEntity<ApiResponse<DatasetRecordResponse>> createRecord(
            @Valid @RequestBody DatasetRecordRequest request
    ) {
        DatasetRecordResponse response = datasetService.createRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Record created successfully", response));
    }

    @PostMapping("/records/bulk")
    public ResponseEntity<ApiResponse<List<DatasetRecordResponse>>> createRecordsBulk(
            @Valid @RequestBody List<DatasetRecordRequest> requests
    ) {
        List<DatasetRecordResponse> responses = datasetService.createRecordsBulk(requests);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Records created successfully", responses));
    }

    @GetMapping("/{datasetId}/records")
    public ResponseEntity<ApiResponse<List<DatasetRecordResponse>>> getRecords(
            @PathVariable String datasetId
    ) {
        List<DatasetRecordResponse> responses = datasetService.getRecordsByDatasetId(datasetId);
        return ResponseEntity.ok(ApiResponse.success("Records retrieved successfully", responses));
    }

    @GetMapping("/{datasetId}/count")
    public ResponseEntity<ApiResponse<Long>> countRecords(
            @PathVariable String datasetId
    ) {
        long count = datasetService.countRecords(datasetId);
        return ResponseEntity.ok(ApiResponse.success("Record count retrieved successfully", count));
    }

    @DeleteMapping("/{datasetId}")
    public ResponseEntity<ApiResponse<Void>> deleteDataset(
            @PathVariable String datasetId
    ) {
        datasetService.deleteDataset(datasetId);
        return ResponseEntity.ok(ApiResponse.success("Dataset deleted successfully", null));
    }
}
