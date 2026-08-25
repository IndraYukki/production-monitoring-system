package com.productionmonitoring.monitoring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OperatorDetailCardDTO {
    private Long totalOutput;
    private Long totalOk;
    private Long totalWip;
    private Long totalNg;
    private Long totalTarget;
    private Double achievePercent;
    private Long totalUptime;
    private Long totalLogs;
    private Long totalLogsAchieve;
    private String uptimeDisplay;
    private String operatorName;
    private String nik;
    private String groub;
}
