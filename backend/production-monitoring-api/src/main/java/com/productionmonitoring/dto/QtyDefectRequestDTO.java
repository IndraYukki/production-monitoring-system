package com.productionmonitoring.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QtyDefectRequestDTO {

    @NotNull(message = "Jenis NG defect tidak boleh kosong")
    private Long ngDefectId;

    @NotNull(message = "Qty NG tidak boleh kosong")
    @Positive(message = "Qty NG harus lebih dari 0")
    private Integer qtyNg;
}
