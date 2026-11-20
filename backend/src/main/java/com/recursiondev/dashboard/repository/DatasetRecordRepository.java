package com.recursiondev.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.recursiondev.dashboard.entity.DatasetRecord;

@Repository
public interface DatasetRecordRepository
        extends JpaRepository<DatasetRecord, Long> {

}