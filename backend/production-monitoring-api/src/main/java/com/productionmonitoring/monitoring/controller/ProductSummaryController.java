package com.productionmonitoring.monitoring.controller;

import com.productionmonitoring.monitoring.ProductSummaryService;
import com.productionmonitoring.monitoring.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/monitoring/product-summary")
@CrossOrigin
@RequiredArgsConstructor
public class ProductSummaryController {

    private final ProductSummaryService productSummaryService;

    // =========================================================================
    // HALAMAN UTAMA
    // =========================================================================

    /**
     * GET /api/monitoring/product-summary/cards
     * Cards agregat global — total output, target, NG, NG rate, achieve.
     */
    @GetMapping("/cards")
    public ResponseEntity<ProductSummaryCardDTO> getSummaryCards(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai,
            @RequestParam(required = false) Long machineId,
            @RequestParam(required = false) Long customerId
    ) {
        return ResponseEntity.ok(
                productSummaryService.getSummaryCards(tanggalMulai, tanggalSelesai, machineId, customerId)
        );
    }

    /**
     * GET /api/monitoring/product-summary/chart-ng
     * Distribusi NG per jenis defect untuk chart.
     */
    @GetMapping("/chart-ng")
    public ResponseEntity<List<ProductSummaryChartDTO>> getChartNg(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai,
            @RequestParam(required = false) Long machineId,
            @RequestParam(required = false) Long customerId
    ) {
        return ResponseEntity.ok(
                productSummaryService.getChartNg(tanggalMulai, tanggalSelesai, machineId, customerId)
        );
    }

    /**
     * GET /api/monitoring/product-summary
     * List produk dengan agregat — pageable + sort.
     */
    @GetMapping
    public ResponseEntity<Page<ProductSummaryRowDTO>> getSummaryList(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai,
            @RequestParam(required = false) Long machineId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0")            int halaman,
            @RequestParam(defaultValue = "10")           int jumlah,
            @RequestParam(defaultValue = "totalOutput")  String sortBy,
            @RequestParam(defaultValue = "desc")         String sortDir
    ) {
        Pageable pageable = PageRequest.of(halaman, jumlah);
        return ResponseEntity.ok(
                productSummaryService.getSummaryList(
                        tanggalMulai, tanggalSelesai, machineId, customerId,
                        keyword, pageable, sortBy, sortDir)
        );
    }

    // =========================================================================
    // HALAMAN DETAIL PER PRODUK
    // =========================================================================

    /**
     * GET /api/monitoring/product-summary/{productId}/detail-product/cards
     * Cards agregat satu produk.
     */
    @GetMapping("/{productId}/detail-product/cards")
    public ResponseEntity<ProductDetailCardDTO> getDetailCards(
            @PathVariable Long productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai,
            @RequestParam(required = false) Long machineId
    ) {
        return ResponseEntity.ok(
                productSummaryService.getDetailCards(
                        productId, tanggalMulai, tanggalSelesai, machineId)
        );
    }

    /**
     * GET /api/monitoring/product-summary/{productId}/detail-product/chart
     * Distribusi NG per jenis defect satu produk.
     */
    @GetMapping("/{productId}/detail-product/chart")
    public ResponseEntity<List<ProductDetailChartDTO>> getDetailChartNg(
            @PathVariable Long productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai,
            @RequestParam(required = false) Long machineId
    ) {
        return ResponseEntity.ok(
                productSummaryService.getDetailChartNg(
                        productId, tanggalMulai, tanggalSelesai, machineId)
        );
    }

    /**
     * GET /api/monitoring/product-summary/{productId}/detail-product
     * Logs detail per produk — pageable.
     */
    @GetMapping("/{productId}/detail-product")
    public ResponseEntity<Page<ProductDetailLogDTO>> getDetailLogs(
            @PathVariable Long productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai,
            @RequestParam(required = false) Long machineId,
            @RequestParam(defaultValue = "0")           int halaman,
            @RequestParam(defaultValue = "10")          int jumlah
    ) {
        Pageable pageable = PageRequest.of(halaman, jumlah);
        return ResponseEntity.ok(
                productSummaryService.getDetailLogs(
                        productId, tanggalMulai, tanggalSelesai, machineId, pageable)
        );
    }
}