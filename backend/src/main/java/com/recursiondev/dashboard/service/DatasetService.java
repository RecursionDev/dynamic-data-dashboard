package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.config.CacheConfig;
import com.recursiondev.dashboard.dto.request.DatasetRecordRequest;
import com.recursiondev.dashboard.dto.response.DatasetRecordResponse;
import com.recursiondev.dashboard.entity.DatasetRecord;
import com.recursiondev.dashboard.repository.DatasetRecordRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DatasetService {

    private final DatasetRecordRepository recordRepository;

    public DatasetService(DatasetRecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    @CacheEvict(value = {CacheConfig.QUERY_CACHE, CacheConfig.METRIC_CACHE}, allEntries = true)
    public DatasetRecordResponse createRecord(DatasetRecordRequest request) {
        DatasetRecord entity = toEntity(request);
        DatasetRecord saved = recordRepository.save(entity);
        return toResponse(saved);
    }

    @CacheEvict(value = {CacheConfig.QUERY_CACHE, CacheConfig.METRIC_CACHE}, allEntries = true)
    public List<DatasetRecordResponse> createRecordsBulk(List<DatasetRecordRequest> requests) {
        List<DatasetRecord> entities = requests.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
        List<DatasetRecord> saved = recordRepository.saveAll(entities);
        return saved.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DatasetRecordResponse> getRecordsByDatasetId(String datasetId) {
        return recordRepository.findByDatasetId(datasetId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countRecords(String datasetId) {
        return recordRepository.countByDatasetId(datasetId);
    }

    @CacheEvict(value = {CacheConfig.QUERY_CACHE, CacheConfig.METRIC_CACHE}, allEntries = true)
    public void deleteDataset(String datasetId) {
        recordRepository.deleteByDatasetId(datasetId);
    }

    private DatasetRecord toEntity(DatasetRecordRequest req) {
        DatasetRecord record = new DatasetRecord();
        record.setDatasetId(req.getDatasetId());
        record.setDimension(req.getDimension());
        record.setMetricName(req.getMetricName() != null ? req.getMetricName() : "value");
        record.setMetricValue(req.getMetricValue() != null ? req.getMetricValue() : 0.0);
        record.setSecondaryDimension(req.getSecondaryDimension());
        record.setRecordDate(req.getRecordDate());
        return record;
    }

    private DatasetRecordResponse toResponse(DatasetRecord record) {
        return new DatasetRecordResponse(
                record.getId(),
                record.getDatasetId(),
                record.getDimension(),
                record.getMetricName(),
                record.getMetricValue(),
                record.getSecondaryDimension(),
                record.getRecordDate(),
                record.getCreatedAt()
        );
    }
}
