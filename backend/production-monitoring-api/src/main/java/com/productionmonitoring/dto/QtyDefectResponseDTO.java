package com.productionmonitoring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QtyDefectResponseDTO {

    private Long id;
    private Long ngDefectId;
    private String ngDefectName;
    private Integer qtyNg;
}
