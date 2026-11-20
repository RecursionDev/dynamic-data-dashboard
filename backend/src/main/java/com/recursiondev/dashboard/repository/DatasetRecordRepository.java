package com.recursiondev.dashboard.repository;

import com.recursiondev.dashboard.entity.DatasetRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatasetRecordRepository extends JpaRepository<DatasetRecord, Long>, JpaSpecificationExecutor<DatasetRecord> {

    List<DatasetRecord> findByDatasetId(String datasetId);

    long countByDatasetId(String datasetId);

    void deleteByDatasetId(String datasetId);
}
