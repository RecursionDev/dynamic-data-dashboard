package com.recursiondev.dashboard.service;

import org.springframework.stereotype.Service;

import com.recursiondev.dashboard.dto.request.DatasetRecordRequest;
import com.recursiondev.dashboard.entity.DatasetRecord;
import com.recursiondev.dashboard.repository.DatasetRecordRepository;

@Service
public class DatasetService {

    private final DatasetRecordRepository datasetRecordRepository;

    public DatasetService(DatasetRecordRepository datasetRecordRepository) {
        this.datasetRecordRepository = datasetRecordRepository;
    }

    public DatasetRecord createRecord(DatasetRecordRequest request) {

        DatasetRecord record = new DatasetRecord(
                request.region(),
                request.product(),
                request.amount()
        );

        return datasetRecordRepository.save(record);
    }
}