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
    private Double cycleTime = 0.0;
    private Integer cavity = 0;
    private Double takeTime = 0.0;

    private Long customerId;
    private String customerName;

    public Double getCycleTime() {
        return cycleTime != null ? cycleTime: 0.0;
    }
    public Integer getCavity() {
        return cavity != null ? cavity: 0;
    }
    public Double getTakeTime() {
        return takeTime != null ? takeTime: 0.0;
    }
}