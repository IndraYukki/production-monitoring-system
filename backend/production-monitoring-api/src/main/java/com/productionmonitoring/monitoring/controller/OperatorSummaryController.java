package com.productionmonitoring.monitoring.controller;

import com.productionmonitoring.monitoring.OperatorSummaryService;
import com.productionmonitoring.monitoring.dto.OperatorDetailCardDTO;
import com.productionmonitoring.monitoring.dto.OperatorDetailLogDTO;
import com.productionmonitoring.monitoring.dto.OperatorSummaryCardDTO;
import com.productionmonitoring.monitoring.dto.OperatorSummaryRowDTO;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/monitoring")
@CrossOrigin
public class OperatorSummaryController {

    private final OperatorSummaryService operatorSummaryService;

    public OperatorSummaryController(OperatorSummaryService operatorSummaryService) {
        this.operatorSummaryService = operatorSummaryService;
    }

    @GetMapping("/operator-summary/cards")
    public OperatorSummaryCardDTO getSummaryCards(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai,
            @RequestParam(required = false) String groub
    ) {
        return operatorSummaryService.getSummaryCards(tanggalMulai, tanggalSelesai, groub);
    }

    @GetMapping("/operator-summary")
    public Page<OperatorSummaryRowDTO> getOperatorSummaryList(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai,
            @RequestParam(required = false) String groub,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int halaman,
            @RequestParam(defaultValue = "10") int jumlah
    ) {
        return operatorSummaryService.getOperatorSummaryList(
                tanggalMulai, tanggalSelesai, groub, keyword, halaman, jumlah
        );
    }

    @GetMapping("/operator-summary/{operatorId}")
    public Page<OperatorDetailLogDTO> getOperatorDetailLogs(
            @PathVariable Long operatorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai,
            @RequestParam(defaultValue = "0") int halaman,
            @RequestParam(defaultValue = "10") int jumlah
    ) {
        return operatorSummaryService.getOperatorDetailLogs(
                operatorId, tanggalMulai, tanggalSelesai, halaman, jumlah
        );
    }

    @GetMapping("/operator-summary/{operatorId}/cards")
    public OperatorDetailCardDTO getOperatorDetailCards(
            @PathVariable Long operatorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalMulai,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tanggalSelesai
    ) {
        return operatorSummaryService.getOperatorDetailCards(
                operatorId, tanggalMulai, tanggalSelesai
        );
    }
}