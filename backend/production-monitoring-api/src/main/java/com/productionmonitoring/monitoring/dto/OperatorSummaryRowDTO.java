package com.productionmonitoring.monitoring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OperatorSummaryRowDTO {
    private Long operatorId;
    private String operatorName;
    private String nik;
    private String groub;
    private Long totalOutput;
    private Long totalTarget;
    private Long totalOk;
    private Long totalWip;
    private Double achievePercent;
    private Integer totalLogs;
}
