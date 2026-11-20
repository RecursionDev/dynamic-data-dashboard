package com.recursiondev.dashboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.recursiondev.dashboard.dto.request.DatasetRecordRequest;
import com.recursiondev.dashboard.entity.DatasetRecord;
import com.recursiondev.dashboard.service.DatasetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/datasets")
public class DatasetController {

    private final DatasetService datasetService;

    public DatasetController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @PostMapping("/records")
    public ResponseEntity<DatasetRecord> createRecord(
            @Valid @RequestBody DatasetRecordRequest request) {

        DatasetRecord savedRecord = datasetService.createRecord(request);

        return ResponseEntity.ok(savedRecord);
    }
}