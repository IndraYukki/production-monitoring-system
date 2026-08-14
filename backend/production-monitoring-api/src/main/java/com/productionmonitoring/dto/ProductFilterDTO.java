package com.productionmonitoring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFilterDTO {

    private String keyword;
    private Long customerId;
    private String status;
}