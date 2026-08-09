package com.productionmonitoring.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ProductionRequestDTO {

    private Long productId;
    private Long machineId;

    private String shift;
    private Long operator1Id;
    private Long operator2Id;
    private Long operator3Id;

    @NotNull(message = "Uptime mesin tidak boleh kosong")
    @PositiveOrZero(message = "Uptime mesin tidak boleh negatif")
    private Integer uptimeMc = 0;

    @PositiveOrZero(message = "Qty OK tidak boleh negatif")
    private Integer qtyOk = 0;

    @PositiveOrZero(message = "Qty WIP tidak boleh negatif")
    private Integer qtyWip = 0;

    private LocalDate productionLot;

    private String remark = "";

    @Valid
    private List<QtyDefectRequestDTO> defects;


    public Integer getUptimeMc() {
        return uptimeMc != null ? uptimeMc : 0;
    }

    public Integer getQtyOk() {
        return qtyOk != null ? qtyOk : 0;
    }

    public Integer getQtyWip() {
        return qtyWip != null ? qtyWip : 0;
    }
    public String getRemark() {
        return remark != null ? remark : "";
    }
}