package com.productionmonitoring.monitoring.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class OperatorDetailLogDTO {
    private Long productionId;
    private String partNo;
    private String partName;
    private String machineName;
    private String shift;
    private LocalDate productionLot;
    private Integer qtyOk;
    private Integer qtyWip;
    private Integer totalOutput;
    private Integer uptimeMc;
    private String uptimeDisplay;
    private Integer target;
    private Integer achievePercent;
    private String status;
    private Integer qtyNg;
}