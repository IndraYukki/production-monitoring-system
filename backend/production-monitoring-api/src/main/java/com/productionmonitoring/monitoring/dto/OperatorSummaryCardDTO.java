package com.productionmonitoring.monitoring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OperatorSummaryCardDTO {
    private Integer totalOutput;
    private Integer totalTarget;
    private Integer totalAchieve;
}