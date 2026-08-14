package com.productionmonitoring.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ProductionResponseDTO {

    private Long id;
    private Long productId;
    private String partNo;
    private String partName;
    private String status;
    private Long machineId;
    private String machineName;
    private String shift;
    private Long operator1Id;
    private String operator1Name;
    private String groub1 = "";
    private Long operator2Id;
    private String operator2Name;
    private String groub2 = "";
    private Long operator3Id;
    private String operator3Name;
    private String groub3 = "";
    private Integer uptimeMc;
    private Integer qtyOk = 0;
    private Integer qtyWip = 0;
    private Integer cycleTime = 0;
    private Integer cavity = 0;
    private Integer takeTime = 0;
    private LocalDate productionLot;
    private Timestamp createdAt;
    private String remark = "";
    private List<QtyDefectResponseDTO> defects;
    private Long customerId;
    private String customerName;


    public Integer getUptimeMc() {
        return uptimeMc != null ? uptimeMc : 0;
    }

    public Integer getQtyOk() {
        return qtyOk != null ? qtyOk : 0;
    }

    public Integer getQtyWip() {
        return qtyWip != null ? qtyWip : 0;
    }

    public Integer getCycleTime() {
        return cycleTime != null ? cycleTime : 0;
    }

    public Integer getCavity() {
        return cavity != null ? cavity : 0;
    }

    public Integer getTakeTime() {
        return takeTime != null ? takeTime : 0;
    }
    public String getRemark() {
        return remark != null ? remark : "";
    }
    public String getGroub1() {
        return groub1 != null ? groub1 : "";
    }
    public String getGroub2() {
        return groub2 != null ? groub2 : "";
    }
    public String getGroub3() {
        return groub3 != null ? groub3 : "";
    }

}
