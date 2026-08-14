package com.productionmonitoring.specification;

import com.productionmonitoring.entity.Products;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Products> filter(
            String keyword,
            Long customerId,
            String status
    ) {
        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Filter Part No / Part Name
            if (keyword != null && !keyword.isBlank()) {

                String keywordPattern = "%" + keyword.toLowerCase() + "%";

                Predicate partNo = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("partNo")),
                        keywordPattern
                );

                Predicate partName = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("partName")),
                        keywordPattern
                );

                predicates.add(
                        criteriaBuilder.or(partNo, partName)
                );
            }

            // Filter Customer
            if (customerId != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("customer").get("id"),
                                customerId
                        )
                );
            }

            // Filter Status
            if (status != null && !status.isBlank()) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("status"),
                                status
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}