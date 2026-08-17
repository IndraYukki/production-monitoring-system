package com.productionmonitoring.monitoring;

import com.productionmonitoring.monitoring.dto.OperatorDetailCardDTO;
import com.productionmonitoring.monitoring.dto.OperatorSummaryCardDTO;
import com.productionmonitoring.monitoring.dto.OperatorSummaryRowDTO;
import com.productionmonitoring.monitoring.dto.OperatorDetailLogDTO;
import com.productionmonitoring.entity.Operator;
import com.productionmonitoring.entity.Production;
import com.productionmonitoring.repository.OperatorRepository;
import com.productionmonitoring.repository.ProductionRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

            totalOutput += hitungOutput(p);
            totalTarget += hitungTarget(p);
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
            int jumlah
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
                totalOutput += hitungOutput(p);
                totalTarget += hitungTarget(p);
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
            int jumlah
    ) {
        Pageable pageable = PageRequest.of(halaman, jumlah, Sort.by(Sort.Direction.DESC, "productionLot"));

        Page<Production> page = productionRepository
                .findByOperatorAndLotRange(operatorId, tanggalMulai, tanggalSelesai, pageable);

        return page.map(this::toDetailLogDTO);
    }

    // ─── HELPER ──────────────────────────────────────────────────
    private int hitungOutput(Production p) {
        int ok  = p.getQtyOk()  != null ? p.getQtyOk()  : 0;
        int wip = p.getQtyWip() != null ? p.getQtyWip() : 0;
        int ng  = hitungTotalNg(p);
        return ok + wip + ng;
    }

    private int hitungTotalNg(Production p) {
        if (p.getDefects() == null) return 0;
        return p.getDefects().stream()
                .mapToInt(d -> d.getQtyNg() != null ? d.getQtyNg() : 0)
                .sum();
    }

    private int hitungTarget(Production p) {
        if (p.getMachine() == null || p.getProduct() == null) return 0;

        boolean isWip = p.getMachine().getName().equalsIgnoreCase("WIP");
        int waktu  = isWip
                ? (p.getProduct().getTakeTime()  != null ? p.getProduct().getTakeTime()  : 0)
                : (p.getProduct().getCycleTime() != null ? p.getProduct().getCycleTime() : 0);

        if (waktu == 0) return 0;

        int cavity  = p.getProduct().getCavity()  != null ? p.getProduct().getCavity()  : 0;
        int uptime  = p.getUptimeMc()             != null ? p.getUptimeMc()             : 0;

        return (int) Math.ceil((double) 3600 / waktu * cavity * (uptime / 60.0));
    }

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
        dto.setUptimeDisplay(formatUptime(p.getUptimeMc()));

        if (p.getProduct() != null) {
            dto.setPartNo(p.getProduct().getPartNo());
            dto.setPartName(p.getProduct().getPartName());
        }
        if (p.getMachine() != null) {
            dto.setMachineName(p.getMachine().getName());
        }

        int ok     = p.getQtyOk()  != null ? p.getQtyOk()  : 0;
        int wip    = p.getQtyWip() != null ? p.getQtyWip() : 0;
        int ng     = hitungTotalNg(p);
        int output = ok + wip + ng;
        int target = hitungTarget(p);
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
    private String formatUptime(Integer menitTotal) {
        if (menitTotal == null || menitTotal == 0) return "0 menit";
        int jam = menitTotal / 60;
        int menit = menitTotal % 60;
        if (jam == 0) return menit + " menit";
        if (menit == 0) return jam + " jam";
        return jam + " jam " + menit + " menit";
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
            int ng  = hitungTotalNg(p);
            int output = ok + wip + ng;
            int target = hitungTarget(p);

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
        dto.setUptimeDisplay(formatUptime(totalUptime));
        dto.setOperatorName(operator.getName());
        dto.setNik(operator.getNik());
        dto.setGroub(operator.getGroub());
        return dto;
    }
}