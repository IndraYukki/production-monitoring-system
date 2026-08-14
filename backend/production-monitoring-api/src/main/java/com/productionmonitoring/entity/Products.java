package com.productionmonitoring.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Part No tidak boleh kosong")
    @Column(name = "part_no", nullable = false, unique = true)
    private String partNo;

    @NotBlank(message = "Part Name tidak boleh kosong")
    @Column(name = "part_name", nullable = false)
    private String partName;

    private String color;

    @NotNull(message = "Cycle Time tidak boleh kosong")
    @Column(name = "cycle_time")
    private Integer cycleTime;

    @NotNull(message = "Cavity tidak boleh kosong")
    private Integer cavity;

    @Column(name = "take_time")
    private Integer takeTime;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String status;
}
