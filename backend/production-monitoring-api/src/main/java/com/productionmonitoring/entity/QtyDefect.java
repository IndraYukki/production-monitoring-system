package com.productionmonitoring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "qty_defects")
@Getter
@Setter
public class QtyDefect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer qtyNg;


    @ManyToOne
    @JoinColumn(name = "production_id")
    @JsonIgnore
    private Production production;


    @ManyToOne
    @JoinColumn(name = "ng_defect_id")
    private NgDefect ngDefect;
}