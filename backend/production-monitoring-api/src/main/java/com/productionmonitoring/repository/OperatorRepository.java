package com.productionmonitoring.repository;

import com.productionmonitoring.entity.Operator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


import java.util.List;

public interface OperatorRepository extends JpaRepository<Operator, Long> {

    @Query("""
    SELECT o FROM Operator o
    WHERE (
        :keyword IS NULL
        OR :keyword = ''
        OR LOWER(o.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(o.nik) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
    AND (
        :groub IS NULL
        OR :groub = ''
        OR LOWER(o.groub) = LOWER(:groub)
    )
    AND (
        (:groub IS NULL OR :groub = '')
        AND o.groub != 'RESIGN'
        OR LOWER(o.groub) = LOWER(:groub)
    )
""")
    Page<Operator> searchOperator(
            @Param("keyword") String keyword,
            @Param("groub") String groub,
            Pageable pageable
    );

    List<Operator> findByNameContainingIgnoreCaseOrNikContainingIgnoreCase(
            String name,
            String nik
    );

    @Query(value = """
    SELECT * FROM operators
    WHERE (CAST(:keyword AS TEXT) IS NULL 
        OR LOWER(name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(nik) LIKE LOWER(CONCAT('%', :keyword, '%')))
    AND (
        CASE WHEN (CAST(:groub AS TEXT) IS NULL OR :groub = '')
             THEN groub <> 'RESIGN'
             ELSE groub = :groub
        END
    )
    ORDER BY name ASC
""", nativeQuery = true)
    List<Operator> findForSummary(
            @Param("keyword") String keyword,
            @Param("groub") String groub
    );
}