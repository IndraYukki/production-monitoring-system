package com.productionmonitoring.monitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryCardDTO {

    private Long   totalOutput;
    private Long   totalTarget;
    private Long   totalNg;
    private Double totalNgRate;   // 2 desimal (ProductionCalculator.hitungNgRate), 0 jika output = 0
    private Double totalAchieve;  // 2 desimal (ProductionCalculator.hitungAchieve), 0 jika target = 0
    private Long   totalUptime;   // menit (SUM uptime_mc)
    private String uptimeDisplay; // formatUptime(totalUptime)
}