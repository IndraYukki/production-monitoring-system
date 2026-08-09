package com.productionmonitoring.service;

import com.productionmonitoring.repository.ProductionRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductionExportService {

    private final ProductionRepository productionRepository;

    public ProductionExportService(
            ProductionRepository productionRepository
    ) {
        this.productionRepository = productionRepository;
    }

}