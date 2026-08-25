package com.productionmonitoring.monitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryChartDTO {

    private String defectName;
    private Long   totalNg;
}