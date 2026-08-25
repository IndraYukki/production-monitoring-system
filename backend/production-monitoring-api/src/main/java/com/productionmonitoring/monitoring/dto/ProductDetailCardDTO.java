package com.productionmonitoring.monitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailCardDTO {

    private Long   productId;
    private String partNo;
    private String partName;
    private String customerName;

    private Long   totalOutput;
    private Long   totalTarget;
    private Long   totalOk;
    private Long   totalWip;
    private Long   totalNg;
    private Double ngRate;        // 2 desimal (ProductionCalculator.hitungNgRate)
    private Double achievePct;    // 2 desimal (ProductionCalculator.hitungAchieve)
    private long   totalLogs;
    private long   totalLogsAchieve;
    private Long   totalUptime;
    private String uptimeDisplay; // formatUptime(totalUptime)
}