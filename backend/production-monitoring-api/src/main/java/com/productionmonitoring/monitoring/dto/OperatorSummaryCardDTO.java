package com.productionmonitoring.monitoring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OperatorSummaryCardDTO {
    private Long totalOutput;
    private Long totalTarget;
    private Double totalAchieve;
}
