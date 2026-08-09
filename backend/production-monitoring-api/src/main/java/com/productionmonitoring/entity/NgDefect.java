package com.productionmonitoring.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ng_defects")
@Getter
@Setter
public class NgDefect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nama NG defect tidak boleh kosong")
    @Column(nullable = false, unique = true)
    private String name;

    private String description;
}