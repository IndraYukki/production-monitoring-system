package com.productionmonitoring.repository;

import com.productionmonitoring.entity.NgDefect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NgDefectRepository extends JpaRepository<NgDefect, Long> {
}
