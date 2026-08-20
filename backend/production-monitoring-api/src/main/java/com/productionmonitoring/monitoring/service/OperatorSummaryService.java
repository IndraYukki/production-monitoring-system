package com.productionmonitoring.monitoring;

import com.productionmonitoring.dto.QtyDefectResponseDTO;
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
        List<Production> productions = productionRepository
                .findByLotRange(tanggalMulai, tanggalSelesai);

        int totalOutput = 0;
        int totalTarget = 0;

        for (Production p : productions) {
            if (p.getProduct() == null || p.getMachine() == null) continue;
            if (!operatorMatchGroub(p, groub)) continue;

            totalOutput += ProductionCalculator.hitungOutput(p);
            totalTarget += ProductionCalculator.hitungTarget(p);
        }

        int achievePercent = totalTarget > 0
                ? (int) Math.floor((double) totalOutput / totalTarget * 100)
                : 0;

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
            List<Production> productions = productionRepository
                    .findByOperatorAndLotRange(operator.getId(), tanggalMulai, tanggalSelesai);

            if (productions.isEmpty()) continue;

            int totalOk = 0, totalWip = 0, totalOutput = 0, totalTarget = 0;
            int totalLogs = 0;

            for (Production p : productions) {
                if (p.getProduct() == null || p.getMachine() == null) continue;
                totalOk     += p.getQtyOk() != null ? p.getQtyOk() : 0;
                totalWip    += p.getQtyWip() != null ? p.getQtyWip() : 0;
                totalOutput += ProductionCalculator.hitungOutput(p);
                totalTarget += ProductionCalculator.hitungTarget(p);
                totalLogs++;
            }

            int achievePercent = totalTarget > 0
                    ? (int) Math.floor((double) totalOutput / totalTarget * 100)
                    : 0;

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
            row.setTotalLogs(totalLogs);
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

        return productionRepository
                .findByOperatorAndLotRange(operatorId, tanggalMulai, tanggalSelesai, pageable)
                .map(this::toDetailLogDTO);
    }

    // ─── HELPER ──────────────────────────────────────────────────

    private boolean operatorMatchGroub(Production p, String groub) {
        // Cek apakah salah satu operator di production record match groub
        List<Operator> ops = new ArrayList<>();
        if (p.getOperator1() != null) ops.add(p.getOperator1());
        if (p.getOperator2() != null) ops.add(p.getOperator2());
        if (p.getOperator3() != null) ops.add(p.getOperator3());

        if (groub == null || groub.isBlank()) {
            return ops.stream().anyMatch(o -> !"RESIGN".equalsIgnoreCase(o.getGroub()));
        }
        return ops.stream().anyMatch(o -> groub.equalsIgnoreCase(o.getGroub()));
    }

    private OperatorDetailLogDTO toDetailLogDTO(Production p) {
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
        // Customer
        if (p.getProduct() != null && p.getProduct().getCustomer() != null) {
            dto.setCustomerId(p.getProduct().getCustomer().getId());
            dto.setCustomerName(p.getProduct().getCustomer().getCustomer());
        }

// Operator
        if (p.getOperator1() != null) {
            dto.setOperator1Id(p.getOperator1().getId());
            dto.setOperator1Name(p.getOperator1().getName());
            dto.setGroub1(p.getOperator1().getGroub());
        }
        if (p.getOperator2() != null) {
            dto.setOperator2Id(p.getOperator2().getId());
            dto.setOperator2Name(p.getOperator2().getName());
            dto.setGroub2(p.getOperator2().getGroub());
        }
        if (p.getOperator3() != null) {
            dto.setOperator3Id(p.getOperator3().getId());
            dto.setOperator3Name(p.getOperator3().getName());
            dto.setGroub3(p.getOperator3().getGroub());
        }

        // Remark & Defects
        dto.setRemark(p.getRemark());
        if (p.getDefects() != null) {
            dto.setDefects(p.getDefects().stream()
                    .map(d -> {
                        QtyDefectResponseDTO defectDTO = new QtyDefectResponseDTO();
                        defectDTO.setId(d.getId());
                        defectDTO.setQtyNg(d.getQtyNg());
                        if (d.getNgDefect() != null) {
                            defectDTO.setNgDefectId(d.getNgDefect().getId());
                            defectDTO.setNgDefectName(d.getNgDefect().getName());
                        }
                        return defectDTO;
                    })
                    .toList());
        }

        int ok     = p.getQtyOk()  != null ? p.getQtyOk()  : 0;
        int wip    = p.getQtyWip() != null ? p.getQtyWip() : 0;
        int ng = ProductionCalculator.hitungTotalNg(p);
        int output = ok + wip + ng;
        int target = ProductionCalculator.hitungTarget(p);
        int achieve = target > 0
                ? (int) Math.floor((double) output / target * 100)
                : 0;

        dto.setQtyOk(ok);
        dto.setQtyWip(wip);
        dto.setQtyNg(ng);
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
        List<Production> productions = productionRepository
                .findByOperatorAndLotRange(operatorId, tanggalMulai, tanggalSelesai);
        Operator operator = operatorRepository.findById(operatorId)
                .orElseThrow(() -> new RuntimeException("Operator tidak ditemukan"));

        int totalOk = 0, totalWip = 0, totalNg = 0;
        int totalOutput = 0, totalTarget = 0, totalUptime = 0;
        int totalLogs = 0, totalLogsAchieve = 0;

        for (Production p : productions) {
            if (p.getProduct() == null || p.getMachine() == null) continue;

            int ok  = p.getQtyOk()  != null ? p.getQtyOk()  : 0;
            int wip = p.getQtyWip() != null ? p.getQtyWip() : 0;
            int ng = ProductionCalculator.hitungTotalNg(p);
            int output = ok + wip + ng;
            int target = ProductionCalculator.hitungTarget(p);
            totalOk     += ok;
            totalWip    += wip;
            totalNg     += ng;
            totalOutput += output;
            totalTarget += target;
            totalUptime += p.getUptimeMc() != null ? p.getUptimeMc() : 0;
            totalLogs++;
            if (output >= target) totalLogsAchieve++;
        }

        int achievePercent = totalTarget > 0
                ? (int) Math.floor((double) totalOutput / totalTarget * 100)
                : 0;

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
        dto.setUptimeDisplay(ProductionCalculator.formatUptime(totalUptime));
        dto.setOperatorName(operator.getName());
        dto.setNik(operator.getNik());
        dto.setGroub(operator.getGroub());
        return dto;
    }
}