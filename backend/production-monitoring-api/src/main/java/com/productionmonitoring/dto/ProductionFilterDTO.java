package com.productionmonitoring.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProductionFilterDTO {

    private String keyword;

    private LocalDate tanggalMulai;
    private LocalDate tanggalSelesai;

    private Long customerId;
    private Long machineId;

    private String shift;
}