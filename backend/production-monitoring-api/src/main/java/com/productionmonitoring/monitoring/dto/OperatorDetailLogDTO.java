package com.productionmonitoring.monitoring.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Log detail per operator — DTO ramping untuk tabel list.
 * Data lengkap untuk modal diambil via GET /api/production/{id}
 * (ProductionResponseDTO) saat baris diklik — pola sama dengan
 * ProductDetailLogDTO. Jadi DTO ini TIDAK membawa defects/remark/
 * customerName/createdAt/nama operator/groub.
 */
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
    private Double achievePercent;
    private String status;
    private Integer qtyNg;
}
