package com.productionmonitoring.monitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailLogDTO {

    private Long   productionId;
    private String productionLot;
    private String machineName;
    private String shift;

    private String operator1Name;
    private String operator2Name; // "" jika null
    private String operator3Name; // "" jika null

    private int    qtyOk;
    private int    qtyWip;
    private long   totalNg;
    private long   totalOutput;
    private long   target;
    private Double ngRate;        // 2 desimal (ProductionCalculator.hitungNgRate)
    private Double achievePct;    // 2 desimal (ProductionCalculator.hitungAchieve)
    private String status;        // "Tercapai" / "Tidak Target"
    private String uptimeDisplay; // formatUptime(uptimeMc)
}