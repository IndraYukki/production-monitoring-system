package com.productionmonitoring.monitoring.dto;

import com.productionmonitoring.dto.QtyDefectResponseDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

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
    private Long customerId;
    private String customerName;
    private Long operator1Id;
    private String operator1Name;
    private String groub1;
    private Long operator2Id;
    private String operator2Name;
    private String groub2;
    private Long operator3Id;
    private String operator3Name;
    private String groub3;
    private String remark;
    private List<QtyDefectResponseDTO> defects;
}