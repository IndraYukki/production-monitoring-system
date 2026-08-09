package com.productionmonitoring.specification;

import com.productionmonitoring.dto.ProductionFilterDTO;
import com.productionmonitoring.entity.Production;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class ProductionSpecificationBuilder {

    public Specification<Production> build(ProductionFilterDTO filter) {

        Specification<Production> specification = null;

        if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
            specification = ProductionSpecification.keywordProduct(filter.getKeyword());
        }

        if (filter.getCustomerId() != null) {
            Specification<Production> spec = ProductionSpecification.customerId(filter.getCustomerId());
            specification = (specification == null) ? spec : specification.and(spec);
        }

        if (filter.getMachineId() != null) {
            Specification<Production> spec = ProductionSpecification.machineId(filter.getMachineId());
            specification = (specification == null) ? spec : specification.and(spec);
        }

        if (filter.getShift() != null && !filter.getShift().isBlank()) {
            Specification<Production> spec = ProductionSpecification.shift(filter.getShift());
            specification = (specification == null) ? spec : specification.and(spec);
        }

        if (filter.getTanggalMulai() != null) {
            Specification<Production> spec = ProductionSpecification.tanggalMulai(filter.getTanggalMulai());
            specification = (specification == null) ? spec : specification.and(spec);
        }

        if (filter.getTanggalSelesai() != null) {
            Specification<Production> spec = ProductionSpecification.tanggalSelesai(filter.getTanggalSelesai());
            specification = (specification == null) ? spec : specification.and(spec);
        }

        return specification;
    }
}