package com.recursiondev.dashboard.service;

import com.recursiondev.dashboard.dto.request.DashboardQueryRequest;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.entity.DatasetRecord;
import com.recursiondev.dashboard.enums.AggregationType;
import com.recursiondev.dashboard.exception.BadRequestException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class DashboardQueryService {

    public static final Set<String> ALLOWED_GROUP_FIELDS = Collections.unmodifiableSet(
            new LinkedHashSet<>(Arrays.asList("dimension", "metricName", "secondaryDimension", "datasetId"))
    );

    public static final Set<String> ALLOWED_METRIC_FIELDS = Collections.unmodifiableSet(
            new LinkedHashSet<>(Arrays.asList("metricValue", "id"))
    );

    public static final Set<String> ALLOWED_FILTER_FIELDS = Collections.unmodifiableSet(
            new LinkedHashSet<>(Arrays.asList("dimension", "metricName", "secondaryDimension", "datasetId"))
    );

    @PersistenceContext
    private EntityManager entityManager;

    public DashboardQueryService() {
    }

    public DashboardQueryService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    /**
     * Executes a dynamic aggregation query on DatasetRecord using JPA Criteria API.
     *
     * @param request the dashboard query specification
     * @return list of MetricResult containing grouped keys, aggregated values, and record counts
     */
    public List<MetricResult> executeQuery(DashboardQueryRequest request) {
        if (request == null) {
            throw new BadRequestException("DashboardQueryRequest cannot be null");
        }

        validateRequest(request);

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
        Root<DatasetRecord> root = cq.from(DatasetRecord.class);

        // 1. Build Filter Predicates (WHERE clause)
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("datasetId"), request.getDatasetId()));

        if (request.getFilterField() != null && !request.getFilterField().isBlank()
                && request.getFilterValue() != null && !request.getFilterValue().isBlank()) {
            predicates.add(cb.equal(root.get(request.getFilterField()), request.getFilterValue()));
        }

        String metricField = (request.getMetricField() != null && !request.getMetricField().isBlank())
                ? request.getMetricField()
                : "metricValue";

        if (request.getMinMetricValue() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get(metricField), request.getMinMetricValue()));
        }
        if (request.getMaxMetricValue() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get(metricField), request.getMaxMetricValue()));
        }

        cq.where(cb.and(predicates.toArray(new Predicate[0])));

        // 2. Build Aggregation Expression
        Expression<? extends Number> aggExpression = buildAggregationExpression(cb, root, request.getAggregationType(), metricField);

        // 3. GROUP BY and Selection
        boolean hasGroupBy = request.getGroupByField() != null && !request.getGroupByField().isBlank();
        if (hasGroupBy) {
            Path<String> groupPath = root.get(request.getGroupByField());
            cq.multiselect(groupPath, aggExpression, cb.count(root));
            cq.groupBy(groupPath);

            // Sorting
            if ("ASC".equalsIgnoreCase(request.getSortOrder())) {
                cq.orderBy(cb.asc(aggExpression));
            } else {
                cq.orderBy(cb.desc(aggExpression));
            }
        } else {
            // Global aggregation across the entire dataset without group by
            cq.multiselect(cb.literal("TOTAL"), aggExpression, cb.count(root));
        }

        // 4. Execute Query with pagination / limit
        TypedQuery<Object[]> typedQuery = entityManager.createQuery(cq);
        if (request.getLimit() != null && request.getLimit() > 0) {
            typedQuery.setMaxResults(request.getLimit());
        }

        List<Object[]> rows = typedQuery.getResultList();
        List<MetricResult> results = new ArrayList<>();

        for (Object[] row : rows) {
            String groupKey = row[0] != null ? row[0].toString() : "UNKNOWN";
            Double value = 0.0;
            if (row[1] != null && row[1] instanceof Number) {
                value = ((Number) row[1]).doubleValue();
            }
            Long count = 0L;
            if (row.length > 2 && row[2] != null && row[2] instanceof Number) {
                count = ((Number) row[2]).longValue();
            }
            results.add(new MetricResult(groupKey, value, count));
        }

        return results;
    }

    /**
     * Strict allow-list security validation to prevent SQL injection or invalid attribute queries.
     */
    public void validateRequest(DashboardQueryRequest request) {
        if (request.getDatasetId() == null || request.getDatasetId().isBlank()) {
            throw new BadRequestException("datasetId must not be blank");
        }
        if (request.getAggregationType() == null) {
            throw new BadRequestException("aggregationType is required");
        }
        if (request.getGroupByField() != null && !request.getGroupByField().isBlank()) {
            if (!ALLOWED_GROUP_FIELDS.contains(request.getGroupByField())) {
                throw new BadRequestException("Invalid groupByField: '" + request.getGroupByField()
                        + "'. Allowed group fields: " + ALLOWED_GROUP_FIELDS);
            }
        }
        if (request.getMetricField() != null && !request.getMetricField().isBlank()) {
            if (!ALLOWED_METRIC_FIELDS.contains(request.getMetricField())) {
                throw new BadRequestException("Invalid metricField: '" + request.getMetricField()
                        + "'. Allowed metric fields: " + ALLOWED_METRIC_FIELDS);
            }
        }
        if (request.getFilterField() != null && !request.getFilterField().isBlank()) {
            if (!ALLOWED_FILTER_FIELDS.contains(request.getFilterField())) {
                throw new BadRequestException("Invalid filterField: '" + request.getFilterField()
                        + "'. Allowed filter fields: " + ALLOWED_FILTER_FIELDS);
            }
        }
        if (request.getSortOrder() != null && !request.getSortOrder().isBlank()) {
            if (!request.getSortOrder().equalsIgnoreCase("ASC") && !request.getSortOrder().equalsIgnoreCase("DESC")) {
                throw new BadRequestException("Invalid sortOrder: '" + request.getSortOrder()
                        + "'. Must be ASC or DESC.");
            }
        }
    }

    private Expression<? extends Number> buildAggregationExpression(
            CriteriaBuilder cb, Root<DatasetRecord> root, AggregationType aggregationType, String metricField) {
        switch (aggregationType) {
            case SUM:
                return cb.sum(root.get(metricField));
            case AVG:
                return cb.avg(root.get(metricField));
            case COUNT:
                return cb.count(root.get(metricField));
            case MIN:
                return cb.min(root.get(metricField));
            case MAX:
                return cb.max(root.get(metricField));
            default:
                throw new BadRequestException("Unsupported aggregation type: " + aggregationType);
        }
    }

    public Map<String, Object> getAllowedFields() {
        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("allowedGroupFields", ALLOWED_GROUP_FIELDS);
        schema.put("allowedMetricFields", ALLOWED_METRIC_FIELDS);
        schema.put("allowedFilterFields", ALLOWED_FILTER_FIELDS);
        schema.put("allowedAggregationTypes", Arrays.asList(AggregationType.values()));
        return schema;
    }
}
