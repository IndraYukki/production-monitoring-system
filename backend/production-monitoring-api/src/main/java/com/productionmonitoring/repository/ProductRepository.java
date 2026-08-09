package com.productionmonitoring.repository;

import com.productionmonitoring.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Products, Long> {

    List<Products> findByPartNoContainingIgnoreCaseOrPartNameContainingIgnoreCase(
            String partNo,
            String partName
    );
}