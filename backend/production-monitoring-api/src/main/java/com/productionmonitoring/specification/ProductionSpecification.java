package com.productionmonitoring.specification;

import com.productionmonitoring.entity.Production;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ProductionSpecification {

    public static Specification<Production> keywordProduct(String keyword) {

        return (root, query, criteriaBuilder) -> {

            String search = "%" + keyword.toLowerCase() + "%";

            return criteriaBuilder.or(

                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("product").get("partNo")
                            ),
                            search
                    ),

                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("product").get("partName")
                            ),
                            search
                    )
            );
        };
    }

    public static Specification<Production> customerId(Long customerId) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.get("product")
                                .get("customer")
                                .get("id"),
                        customerId
                );
    }
    public static Specification<Production> machineId(Long machineId) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.get("machine").get("id"),
                        machineId
                );
    }
    public static Specification<Production> shift(String shift) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.get("shift"),
                        shift
                );
    }
    public static Specification<Production> tanggalMulai(LocalDate tanggalMulai) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(
                        root.get("productionLot"),
                        tanggalMulai
                );
    }
    public static Specification<Production> tanggalSelesai(LocalDate tanggalSelesai) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(
                        root.get("productionLot"),
                        tanggalSelesai
                );
    }
}