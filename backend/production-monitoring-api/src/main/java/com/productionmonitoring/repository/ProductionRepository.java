package com.productionmonitoring.repository;

import com.productionmonitoring.entity.Production;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductionRepository
        extends JpaRepository<Production, Long>,
        JpaSpecificationExecutor<Production> {

}