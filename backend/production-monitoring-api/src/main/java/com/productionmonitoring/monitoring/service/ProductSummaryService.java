package com.productionmonitoring.monitoring;

import com.productionmonitoring.entity.Products;
import com.productionmonitoring.exception.ResourceNotFoundException;
import com.productionmonitoring.monitoring.dto.*;
import com.productionmonitoring.repository.ProductionRepository;
import com.productionmonitoring.repository.ProductRepository;
import com.productionmonitoring.util.ProductionCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductSummaryService {

    private final ProductionRepository productionRepository;
    private final ProductRepository    productRepository;

    // =========================================================================
    // HALAMAN UTAMA
    // =========================================================================

    /**
     * Cards agregat global — total output, target, NG, NG rate, achieve, uptime.
     */
    public ProductSummaryCardDTO getSummaryCards(
            LocalDate mulai, LocalDate selesai, Long machineId, Long customerId) {

        List<Object[]> rows = productionRepository
                .sumProductionCardsGlobal(mulai, selesai, machineId, customerId);

        if (rows.isEmpty()) {
            return new ProductSummaryCardDTO(0L, 0L, 0L, 0.0, 0.0, 0L, "0 menit");
        }

        Object[] r         = rows.get(0);
        long totalOutput   = toLong(r[0]);
        long totalTarget   = toLong(r[1]);
        long totalNg       = toLong(r[2]);
        long totalUptime   = toLong(r[3]);

        double ngRate = ProductionCalculator.hitungNgRate(totalNg, totalOutput);
        double achieve = ProductionCalculator.hitungAchieve(totalOutput, totalTarget);

        return new ProductSummaryCardDTO(
                totalOutput, totalTarget, totalNg, ngRate, achieve,
                totalUptime,
                ProductionCalculator.formatUptime((int) totalUptime));
    }

    /**
     * Chart NG — distribusi per jenis defect, scope filter tanggal + mesin + customer.
     */
    public List<ProductSummaryChartDTO> getChartNg(
            LocalDate mulai, LocalDate selesai, Long machineId, Long customerId) {

        return productionRepository
                .sumNgPerDefectGlobal(mulai, selesai, machineId, customerId)
                .stream()
                .map(r -> new ProductSummaryChartDTO(
                        (String) r[0],
                        toLong(r[1])
                ))
                .toList();
    }

    /**
     * List produk dengan agregat — pageable + sort di Java.
     * Sort yang tersedia: totalOutput, totalTarget, totalNg, ngRate,
     *                     achievePct, totalLogs, partNo, customerName
     */
    public Page<ProductSummaryRowDTO> getSummaryList(
            LocalDate mulai, LocalDate selesai, Long machineId, Long customerId,
            String keyword, Pageable pageable, String sortBy, String sortDir) {

        List<Object[]> rows = productionRepository
                .sumProductionPerProduct(mulai, selesai, machineId, customerId, keyword);

        List<ProductSummaryRowDTO> list = rows.stream().map(r -> {
            long totalOk     = toLong(r[4]);
            long totalWip    = toLong(r[5]);
            long totalNg     = toLong(r[6]);
            long totalOutput = toLong(r[7]);
            long totalTarget = toLong(r[8]);
            long totalLogs   = toLong(r[9]);
            long totalUptime = toLong(r[10]);

            double ngRate = ProductionCalculator.hitungNgRate(totalNg, totalOutput);
            double achieve = ProductionCalculator.hitungAchieve(totalOutput, totalTarget);

            return new ProductSummaryRowDTO(
                    toLong(r[0]),       // productId
                    (String) r[1],      // partNo
                    (String) r[2],      // partName
                    (String) r[3],      // customerName
                    totalOutput,
                    totalTarget,
                    totalOk,
                    totalWip,
                    totalNg,
                    ngRate,
                    achieve,
                    totalLogs,
                    totalUptime,
                    ProductionCalculator.formatUptime((int) totalUptime)
            );
        }).toList();

        // Sort di Java — acceptable karena data adalah per-produk (tidak sebanyak log)
        List<ProductSummaryRowDTO> sorted = sort(list, sortBy, sortDir);

        // Manual pagination
        int pageSize   = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int start      = pageNumber * pageSize;
        int end        = Math.min(start + pageSize, sorted.size());

        List<ProductSummaryRowDTO> paged = (start >= sorted.size())
                ? List.of()
                : sorted.subList(start, end);

        return new PageImpl<>(paged, pageable, sorted.size());
    }

    // =========================================================================
    // HALAMAN DETAIL PER PRODUK
    // =========================================================================

    /**
     * Cards agregat satu produk.
     */
    public ProductDetailCardDTO getDetailCards(
            Long productId, LocalDate mulai, LocalDate selesai, Long machineId) {

        Products product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product tidak ditemukan: " + productId));

        List<Object[]> rows = productionRepository
                .sumProductionForProductDetail(productId, mulai, selesai, machineId);

        if (rows.isEmpty()) {
            return emptyDetailCard(product);
        }

        Object[] r            = rows.get(0);
        long totalOk          = toLong(r[0]);
        long totalWip         = toLong(r[1]);
        long totalNg          = toLong(r[2]);
        long totalOutput      = toLong(r[3]);
        long totalTarget      = toLong(r[4]);
        long totalUptime      = toLong(r[5]);
        long totalLogs        = toLong(r[6]);
        long totalLogsAchieve = toLong(r[7]);

        double ngRate = ProductionCalculator.hitungNgRate(totalNg, totalOutput);
        double achieve = ProductionCalculator.hitungAchieve(totalOutput, totalTarget);

        return new ProductDetailCardDTO(
                product.getId().longValue(),
                product.getPartNo(),
                product.getPartName(),
                product.getCustomer() != null ? product.getCustomer().getCustomer() : "",
                totalOutput,
                totalTarget,
                totalOk,
                totalWip,
                totalNg,
                ngRate,
                achieve,
                totalLogs,
                totalLogsAchieve,
                totalUptime,
                ProductionCalculator.formatUptime((int) totalUptime)
        );
    }

    /**
     * Chart NG per jenis defect — scope satu produk.
     */
    public List<ProductDetailChartDTO> getDetailChartNg(
            Long productId, LocalDate mulai, LocalDate selesai, Long machineId) {

        return productionRepository
                .sumNgPerDefectForProduct(productId, mulai, selesai, machineId)
                .stream()
                .map(r -> new ProductDetailChartDTO(
                        (String) r[0],
                        toLong(r[1])
                ))
                .toList();
    }

    /**
     * Logs detail per produk — pageable, kalkulasi per baris dari ProductionCalculator.
     */
    public Page<ProductDetailLogDTO> getDetailLogs(
            Long productId, LocalDate mulai, LocalDate selesai,
            Long machineId, Pageable pageable) {

        Page<Object[]> page = productionRepository
                .findLogsForProductDetail(productId, mulai, selesai, machineId, pageable);

        List<ProductDetailLogDTO> list = page.getContent().stream().map(r -> {
            int  qtyOk       = toInt(r[7]);
            int  qtyWip      = toInt(r[8]);
            long totalNg     = toLong(r[9]);
            long totalOutput = toLong(r[10]);
            long target      = toLong(r[11]);
            int  uptimeMc    = toInt(r[12]);

            double ngRate = ProductionCalculator.hitungNgRate(totalNg, totalOutput);
            double achieve = ProductionCalculator.hitungAchieve(totalOutput, target);
            String status = ProductionCalculator.hitungStatus((int) totalOutput, (int) target);

            return new ProductDetailLogDTO(
                    toLong(r[0]),                           // productionId
                    r[1] != null ? r[1].toString() : "",    // productionLot
                    (String) r[2],                          // machineName
                    (String) r[3],                          // shift
                    r[4] != null ? (String) r[4] : "",      // operator1Name
                    r[5] != null ? (String) r[5] : "",      // operator2Name
                    r[6] != null ? (String) r[6] : "",      // operator3Name
                    qtyOk,
                    qtyWip,
                    totalNg,
                    totalOutput,
                    target,
                    ngRate,
                    achieve,
                    status,
                    ProductionCalculator.formatUptime(uptimeMc)
            );
        }).toList();

        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    // =========================================================================
    // HELPER
    // =========================================================================

    private List<ProductSummaryRowDTO> sort(
            List<ProductSummaryRowDTO> list, String sortBy, String sortDir) {

        Comparator<ProductSummaryRowDTO> comparator = switch (sortBy) {
            case "totalTarget"  -> Comparator.comparingLong(ProductSummaryRowDTO::getTotalTarget);
            case "totalNg"      -> Comparator.comparingLong(ProductSummaryRowDTO::getTotalNg);
            case "ngRate"       -> Comparator.comparing(ProductSummaryRowDTO::getNgRate);
            case "achievePct"   -> Comparator.comparing(ProductSummaryRowDTO::getAchievePct);
            case "totalLogs"    -> Comparator.comparingLong(ProductSummaryRowDTO::getTotalLogs);
            case "partNo"       -> Comparator.comparing(ProductSummaryRowDTO::getPartNo);
            case "customerName" -> Comparator.comparing(ProductSummaryRowDTO::getCustomerName);
            default             -> Comparator.comparingLong(ProductSummaryRowDTO::getTotalOutput);
        };

        if ("asc".equalsIgnoreCase(sortDir)) {
            return list.stream().sorted(comparator).toList();
        }
        return list.stream().sorted(comparator.reversed()).toList();
    }

    private ProductDetailCardDTO emptyDetailCard(Products product) {
        return new ProductDetailCardDTO(
                product.getId().longValue(),
                product.getPartNo(),
                product.getPartName(),
                product.getCustomer() != null ? product.getCustomer().getCustomer() : "",
                0L, 0L, 0L, 0L, 0L, 0.0, 0.0, 0L, 0L, 0L, "0 menit"
        );
    }

    private long toLong(Object o) {
        if (o == null) return 0L;
        if (o instanceof Number n) return n.longValue();
        return 0L;
    }

    private int toInt(Object o) {
        if (o == null) return 0;
        if (o instanceof Number n) return n.intValue();
        return 0;
    }
}