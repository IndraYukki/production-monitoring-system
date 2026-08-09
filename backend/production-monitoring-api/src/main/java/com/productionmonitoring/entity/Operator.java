package com.productionmonitoring.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "operators")
@Getter
@Setter
public class Operator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nama operator tidak boleh kosong")
    @Column(nullable = false)
    private String name;

    private String nik;

    @NotBlank(message = "groub tidak boleh kosong")
    private String groub = "";

    public String getGroub() {
        return groub != null ? groub : "";
    }
}