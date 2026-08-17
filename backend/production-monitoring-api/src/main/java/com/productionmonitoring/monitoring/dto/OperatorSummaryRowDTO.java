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
    private Integer totalOutput;
    private Integer totalTarget;
    private Integer totalOk;
    private Integer totalWip;
    private Integer achievePercent;
    private Integer totalLogs;
}