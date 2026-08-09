package com.productionmonitoring.service;

import com.productionmonitoring.entity.Operator;
import com.productionmonitoring.repository.OperatorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperatorService {

    private final OperatorRepository operatorRepository;

    public OperatorService(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }

    public List<Operator> cariOperator(String keyword) {

        return operatorRepository
                .findByNameContainingIgnoreCaseOrNikContainingIgnoreCase(
                        keyword,
                        keyword
                );
    }
}