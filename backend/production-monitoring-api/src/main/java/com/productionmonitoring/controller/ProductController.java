package com.productionmonitoring.controller;

import com.productionmonitoring.dto.ProductFilterDTO;
import com.productionmonitoring.dto.ProductRequestDTO;
import com.productionmonitoring.dto.ProductResponseDTO;
import com.productionmonitoring.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Page<ProductResponseDTO> lihatSemuaProduct(
            @RequestParam(defaultValue = "0") int halaman,
            @RequestParam(defaultValue = "10") int jumlah,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String status
    ) {

        ProductFilterDTO filter = new ProductFilterDTO();

        filter.setKeyword(keyword);
        filter.setCustomerId(customerId);
        filter.setStatus(status);

        return productService.lihatSemuaProduct(
                halaman,
                jumlah,
                filter
        );
    }

    @PostMapping
    public ProductResponseDTO tambahProduct(
            @Valid @RequestBody ProductRequestDTO inputUser
    ) {
        return productService.tambahProduct(inputUser);
    }
    @PutMapping("/{id}")
    public ProductResponseDTO editProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDTO inputUser
    ) {
        return productService.editProduct(id, inputUser);
    }
    @DeleteMapping("/{id}")
    public String hapusProduct(@PathVariable Long id) {
        return productService.hapusProduct(id);
    }

    @GetMapping("/search")
    public List<ProductResponseDTO> cariProduct(
            @RequestParam String keyword
    ) {
        return productService.cariProduct(keyword);
    }
}