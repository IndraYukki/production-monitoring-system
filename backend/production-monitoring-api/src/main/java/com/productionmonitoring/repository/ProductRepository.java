package com.productionmonitoring.repository;

import com.productionmonitoring.entity.Products;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository
        extends JpaRepository<Products, Long>,
        JpaSpecificationExecutor<Products> {

    List<Products> findByPartNoContainingIgnoreCaseOrPartNameContainingIgnoreCase(
            String partNo,
            String partName,
            Sort sort
    );
}