package com.productionmonitoring.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Setter
@Getter
@Entity
@Table(name = "production_raw_reports")
public class Production {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Products product;
    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;
    private String shift;
    @ManyToOne
    @JoinColumn(name = "operator1_id")
    private Operator operator1;
    @ManyToOne
    @JoinColumn(name = "operator2_id")
    private Operator operator2;
    @ManyToOne
    @JoinColumn(name = "operator3_id")
    private Operator operator3;
    @NotNull
    private Integer uptimeMc;
    private Integer qtyOk;
    private Integer qtyWip;
    private LocalDate productionLot;
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;
    private String remark;
    @OneToMany(mappedBy = "production", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QtyDefect> defects;

    public void syncDefectsParent() {
        if (this.defects != null) {
            for (QtyDefect defect : this.defects) {
                defect.setProduction(this);
            }
        }
    }

    public void syncDefectsParent(List<QtyDefect> inputDefects) {
        if (this.defects == null) {
            this.defects = new ArrayList<>();
        } else {
            this.defects.clear();
        }

        if (inputDefects != null) {
            for (QtyDefect defect : inputDefects) {
                defect.setProduction(this);
                this.defects.add(defect);
            }
        }
    }
}
