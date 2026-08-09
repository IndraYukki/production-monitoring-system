package com.productionmonitoring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequestDTO {

    @NotBlank
    private String partNo;

    @NotBlank
    private String partName;

    private String color;

    @NotNull
    private Double cycleTime = 0.0;

    @NotNull
    private Integer cavity = 0;

    private Double takeTime = 0.0;

    @NotNull
    private Long customerId;

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