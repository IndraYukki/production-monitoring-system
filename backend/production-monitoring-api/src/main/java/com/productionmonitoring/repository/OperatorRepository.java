package com.productionmonitoring.repository;

import com.productionmonitoring.entity.Operator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OperatorRepository extends JpaRepository<Operator, Long> {

    List<Operator> findByNameContainingIgnoreCaseOrNikContainingIgnoreCase(
            String name,
            String nik
    );
}