package com.productionmonitoring.monitoring;

import com.productionmonitoring.monitoring.dto.OperatorDetailCardDTO;
import com.productionmonitoring.monitoring.dto.OperatorSummaryCardDTO;
import com.productionmonitoring.monitoring.dto.OperatorSummaryRowDTO;
import com.productionmonitoring.monitoring.dto.OperatorDetailLogDTO;
import com.productionmonitoring.entity.Operator;
import com.productionmonitoring.entity.Production;
import com.productionmonitoring.repository.OperatorRepository;
import com.productionmonitoring.repository.ProductionRepository;
import com.productionmonitoring.util.ProductionCalculator;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OperatorSummaryService {

    private final ProductionRepository productionRepository;
    private final OperatorRepository operatorRepository;

    public OperatorSummaryService(
            ProductionRepository productionRepository,
            OperatorRepository operatorRepository
    ) {
        this.productionRepository = productionRepository;
        this.operatorRepository = operatorRepository;
    }

    // ─── CARD ATAS ────────────────────────────────────────────────
    public OperatorSummaryCardDTO getSummaryCards(
            LocalDate tanggalMulai,
            LocalDate tanggalSelesai,
            String groub
    ) {
        List<Object[]> hasil = productionRepository
                .sumProductionForCards(tanggalMulai, tanggalSelesai, groub);

        long totalOutput = 0;
        long totalTarget = 0;

        if (!hasil.isEmpty()) {
            Object[] baris = hasil.get(0);
            totalOutput = ((Number) baris[0]).longValue();
            totalTarget = ((Number) baris[1]).longValue();
        }

        double achievePercent = ProductionCalculator.hitungAchieve(totalOutput, totalTarget);

        OperatorSummaryCardDTO dto = new OperatorSummaryCardDTO();
        dto.setTotalOutput(totalOutput);
        dto.setTotalTarget(totalTarget);
        dto.setTotalAchieve(achievePercent);
        return dto;
    }

    // ─── TABLE LIST OPERATOR ──────────────────────────────────────
    public Page<OperatorSummaryRowDTO> getOperatorSummaryList(
            LocalDate tanggalMulai,
            LocalDate tanggalSelesai,
            String groub,
            String keyword,
            int halaman,
            int jumlah,
            String sortBy,
            String sortDir
    ) {
        // Ambil operator sesuai filter groub & keyword
        List<Operator> operators = operatorRepository
                .findForSummary(keyword, groub);

        List<OperatorSummaryRowDTO> rows = new ArrayList<>();

        for (Operator operator : operators) {
            List<Object[]> hasil = productionRepository
                    .sumProductionForOperator(operator.getId(), tanggalMulai, tanggalSelesai);

            if (hasil.isEmpty()) continue;

            Object[] baris = hasil.get(0);

            // Urutan kolom ditentukan di ProductionRepository.sumProductionForOperator
            long totalOk     = ((Number) baris[0]).longValue();
            long totalWip    = ((Number) baris[1]).longValue();
            long totalOutput = ((Number) baris[2]).longValue();
            long totalTarget = ((Number) baris[3]).longValue();
            long totalLogs   = ((Number) baris[5]).longValue();

            if (totalLogs == 0) continue;

            double achievePercent = ProductionCalculator.hitungAchieve(totalOutput, totalTarget);

            OperatorSummaryRowDTO row = new OperatorSummaryRowDTO();
            row.setOperatorId(operator.getId());
            row.setOperatorName(operator.getName());
            row.setNik(operator.getNik());
            row.setGroub(operator.getGroub());
            row.setTotalOk(totalOk);
            row.setTotalWip(totalWip);
            row.setTotalOutput(totalOutput);
            row.setTotalTarget(totalTarget);
            row.setAchievePercent(achievePercent);
            row.setTotalLogs((int) totalLogs);
            rows.add(row);
        }
        Comparator<OperatorSummaryRowDTO> comparator = switch (sortBy) {
            case "totalOutput"   -> Comparator.comparing(OperatorSummaryRowDTO::getTotalOutput);
            case "totalTarget"   -> Comparator.comparing(OperatorSummaryRowDTO::getTotalTarget);
            case "achievePercent"-> Comparator.comparing(OperatorSummaryRowDTO::getAchievePercent);
            case "totalLogs"     -> Comparator.comparing(OperatorSummaryRowDTO::getTotalLogs);
            case "totalOk"       -> Comparator.comparing(OperatorSummaryRowDTO::getTotalOk);
            case "totalWip"      -> Comparator.comparing(OperatorSummaryRowDTO::getTotalWip);
            default              -> Comparator.comparing(OperatorSummaryRowDTO::getOperatorName);
        };

        if ("desc".equalsIgnoreCase(sortDir)) {
            comparator = comparator.reversed();
        }

        rows.sort(comparator);

        // Manual pagination
        int start = halaman * jumlah;
        int end   = Math.min(start + jumlah, rows.size());
        List<OperatorSummaryRowDTO> pageContent =
                (start >= rows.size()) ? new ArrayList<>() : rows.subList(start, end);

        return new PageImpl<>(pageContent, PageRequest.of(halaman, jumlah), rows.size());
    }

    // ─── DETAIL LOGS PER OPERATOR ────────────────────────────────
    public Page<OperatorDetailLogDTO> getOperatorDetailLogs(
            Long operatorId,
            LocalDate tanggalMulai,
            LocalDate tanggalSelesai,
            int halaman,
            int jumlah,
            String sortBy,
            String sortDir
    ) {
        List<String> allowedFields = List.of("productionLot", "uptimeMc", "qtyOk", "qtyWip");
        String safeSortBy = allowedFields.contains(sortBy) ? sortBy : "productionLot";
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir)
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(halaman, jumlah, Sort.by(direction, safeSortBy));

        Page<Production> page = productionRepository
                .findByOperatorAndLotRange(operatorId, tanggalMulai, tanggalSelesai, pageable);

        // Total NG per production — satu query agregat, BUKAN lazy-load
        // collection defects per baris (menghindari N+1).
        List<Long> ids = page.getContent().stream()
                .map(Production::getId)
                .toList();

        Map<Long, Integer> ngMap = ids.isEmpty()
                ? Map.of()
                : productionRepository.sumNgPerProductionIds(ids).stream()
                        .collect(Collectors.toMap(
                                r -> ((Number) r[0]).longValue(),
                                r -> ((Number) r[1]).intValue(),
                                (a, b) -> a
                        ));

        List<OperatorDetailLogDTO> list = page.getContent().stream()
                .map(p -> toDetailLogDTO(p, ngMap.getOrDefault(p.getId(), 0)))
                .toList();

        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    // ─── HELPER ──────────────────────────────────────────────────

    private OperatorDetailLogDTO toDetailLogDTO(Production p, int totalNg) {
        OperatorDetailLogDTO dto = new OperatorDetailLogDTO();
        dto.setProductionId(p.getId());
        dto.setShift(p.getShift());
        dto.setProductionLot(p.getProductionLot());
        dto.setUptimeMc(p.getUptimeMc());
        dto.setUptimeDisplay(ProductionCalculator.formatUptime(p.getUptimeMc()));

        if (p.getProduct() != null) {
            dto.setPartNo(p.getProduct().getPartNo());
            dto.setPartName(p.getProduct().getPartName());
        }
        if (p.getMachine() != null) {
            dto.setMachineName(p.getMachine().getName());
        }

        int ok     = p.getQtyOk()  != null ? p.getQtyOk()  : 0;
        int wip    = p.getQtyWip() != null ? p.getQtyWip() : 0;
        int output = ok + wip + totalNg;
        int target = ProductionCalculator.hitungTarget(p);
        double achieve = ProductionCalculator.hitungAchieve(output, target);

        dto.setQtyOk(ok);
        dto.setQtyWip(wip);
        dto.setQtyNg(totalNg);
        dto.setTotalOutput(output);
        dto.setTarget(target);
        dto.setAchievePercent(achieve);
        dto.setStatus(output >= target ? "Tercapai" : "Tidak Target");
        return dto;
    }

    public OperatorDetailCardDTO getOperatorDetailCards(
            Long operatorId,
            LocalDate tanggalMulai,
            LocalDate tanggalSelesai
    ) {
        Operator operator = operatorRepository.findById(operatorId)
                .orElseThrow(() -> new RuntimeException("Operator tidak ditemukan"));

        List<Object[]> hasil = productionRepository
                .sumProductionForOperator(operatorId, tanggalMulai, tanggalSelesai);

        long totalOk = 0, totalWip = 0, totalOutput = 0, totalTarget = 0;
        long totalUptime = 0, totalLogs = 0, totalLogsAchieve = 0;

        if (!hasil.isEmpty()) {
            Object[] baris = hasil.get(0);

            // Urutan kolom ditentukan di ProductionRepository.sumProductionForOperator
            totalOk          = ((Number) baris[0]).longValue();
            totalWip         = ((Number) baris[1]).longValue();
            totalOutput      = ((Number) baris[2]).longValue();
            totalTarget      = ((Number) baris[3]).longValue();
            totalUptime      = ((Number) baris[4]).longValue();
            totalLogs        = ((Number) baris[5]).longValue();
            totalLogsAchieve = ((Number) baris[6]).longValue();
        }

        // output = ok + wip + ng  ->  ng = output - ok - wip
        long totalNg = totalOutput - totalOk - totalWip;

        double achievePercent = ProductionCalculator.hitungAchieve(totalOutput, totalTarget);

        OperatorDetailCardDTO dto = new OperatorDetailCardDTO();
        dto.setTotalOk(totalOk);
        dto.setTotalWip(totalWip);
        dto.setTotalNg(totalNg);
        dto.setTotalOutput(totalOutput);
        dto.setTotalTarget(totalTarget);
        dto.setTotalUptime(totalUptime);
        dto.setTotalLogs(totalLogs);
        dto.setTotalLogsAchieve(totalLogsAchieve);
        dto.setAchievePercent(achievePercent);
        dto.setUptimeDisplay(ProductionCalculator.formatUptime((int) totalUptime));
        dto.setOperatorName(operator.getName());
        dto.setNik(operator.getNik());
        dto.setGroub(operator.getGroub());
        return dto;
    }
}