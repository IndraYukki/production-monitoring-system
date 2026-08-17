package com.productionmonitoring.monitoring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OperatorDetailCardDTO {
    private Integer totalOutput;
    private Integer totalOk;
    private Integer totalWip;
    private Integer totalNg;
    private Integer totalTarget;
    private Integer achievePercent;
    private Integer totalUptime;
    private Integer totalLogs;
    private Integer totalLogsAchieve;
    private String uptimeDisplay;
    private String operatorName;
    private String nik;
    private String groub;
}