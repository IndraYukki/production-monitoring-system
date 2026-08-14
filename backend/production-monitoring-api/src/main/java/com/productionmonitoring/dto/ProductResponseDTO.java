package com.productionmonitoring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductResponseDTO {

    private Long id;
    private String partNo;
    private String partName;
    private String color;
    private Integer cycleTime = 0;
    private Integer cavity = 0;
    private Integer takeTime = 0;

    private Long customerId;
    private String customerName;

    private String status;

    public Integer getCycleTime() {
        return cycleTime != null ? cycleTime: 0;
    }
    public Integer getCavity() {
        return cavity != null ? cavity: 0;
    }
    public Integer getTakeTime() {
        return takeTime != null ? takeTime: 0;
    }
}