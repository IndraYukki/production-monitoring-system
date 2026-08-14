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
    private Integer cycleTime = 0;

    @NotNull
    private Integer cavity = 0;

    private Integer takeTime = 0;

    @NotNull
    private Long customerId;

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
    public String getStatus() {
        return status != null && !status.isBlank()
                ? status
                : "ACTIVE";
    }
}