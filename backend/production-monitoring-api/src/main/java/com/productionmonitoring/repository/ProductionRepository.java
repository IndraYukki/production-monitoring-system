package com.productionmonitoring.repository;

import com.productionmonitoring.entity.Production;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ProductionRepository
        extends JpaRepository<Production, Long>,
        JpaSpecificationExecutor<Production> {

    @Query("SELECT p FROM Production p WHERE p.productionLot BETWEEN :mulai AND :selesai")
    List<Production> findByLotRange(
            @Param("mulai") LocalDate mulai,
            @Param("selesai") LocalDate selesai
    );

    @Query("""
        SELECT p FROM Production p
        WHERE (p.operator1.id = :opId OR p.operator2.id = :opId OR p.operator3.id = :opId)
        AND p.productionLot BETWEEN :mulai AND :selesai
    """)
    List<Production> findByOperatorAndLotRange(
            @Param("opId") Long opId,
            @Param("mulai") LocalDate mulai,
            @Param("selesai") LocalDate selesai
    );

    @Query("""
        SELECT p FROM Production p
        WHERE (p.operator1.id = :opId OR p.operator2.id = :opId OR p.operator3.id = :opId)
        AND p.productionLot BETWEEN :mulai AND :selesai
    """)
    Page<Production> findByOperatorAndLotRange(
            @Param("opId") Long opId,
            @Param("mulai") LocalDate mulai,
            @Param("selesai") LocalDate selesai,
            Pageable pageable
    );
}