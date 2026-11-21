package com.recursiondev.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.recursiondev.dashboard.dto.request.MetricRequest;
import com.recursiondev.dashboard.dto.response.MetricResult;
import com.recursiondev.dashboard.entity.DatasetRecord;
import com.recursiondev.dashboard.enums.AggregationType;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;

@Service
public class MetricService {

    @PersistenceContext
    private EntityManager entityManager;

    public List<MetricResult> executeMetric(MetricRequest request) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        CriteriaQuery<Tuple> query = cb.createTupleQuery();

        Root<DatasetRecord> root = query.from(DatasetRecord.class);

        String groupBy = request.groupBy();
        String field = request.field();

        // Validate fields
        if (!List.of("region", "product").contains(groupBy)) {
            throw new IllegalArgumentException("Invalid group by field");
        }

        if (!List.of("amount").contains(field)) {
            throw new IllegalArgumentException("Invalid aggregation field");
        }

        Expression<?> groupExpression = root.get(groupBy);

        Expression<?> aggregationExpression;

        switch (request.aggregation()) {

            case SUM:
                aggregationExpression = cb.sum(root.<Number>get(field));
                break;

            case COUNT:
                aggregationExpression = cb.count(root.get(field));
                break;

            case AVG:
                aggregationExpression = cb.avg(root.<Number>get(field));
                break;

            case MIN:
                aggregationExpression = cb.min(root.<Number>get(field));
                break;

            case MAX:
                aggregationExpression = cb.max(root.<Number>get(field));
                break;

            default:
                throw new IllegalArgumentException("Unsupported aggregation");
        }

        query.multiselect(
                groupExpression.alias("group"),
                aggregationExpression.alias("result")
        );

        query.groupBy(groupExpression);

        List<Tuple> results = entityManager.createQuery(query).getResultList();

        return results.stream()
                .map(tuple -> new MetricResult(
                        tuple.get("group").toString(),
                        (Number) tuple.get("result")
                ))
                .toList();
    }
}