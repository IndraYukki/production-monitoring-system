package com.productionmonitoring.excel;

import com.productionmonitoring.entity.Production;
import com.productionmonitoring.util.ProductionCalculator;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.List;

public class ProductionExcelExporter {

    public Workbook export(List<Production> productions) {

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Raw Production");

        // ── Header row (row index 0) ──────────────────────────────────────────
        Row headerRow = sheet.createRow(0);
        String[] headers = {
                "Customer",       // 0
                "Part No",        // 1
                "Part Name",      // 2
                "Machine",        // 3
                "Shift",          // 4
                "Up Time MC",     // 5
                "Operator 1",     // 6
                "Operator 2",     // 7
                "Operator 3",     // 8
                "Qty OK",         // 9
                "Qty WIP",        // 10
                "Target PPIC",    // 11
                "Total NG",       // 12
                "Total Produksi", // 13
                "Achievement %",  // 14
                "NG Rate %",      // 15
                "Status",         // 16
                "Production Lot", // 17
                "Remark"          // 18
        };

        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // ── Data rows (mulai dari row index 1) ───────────────────────────────
        int rowIndex = 1;

        for (Production production : productions) {

            // Semua kalkulasi via ProductionCalculator — tidak ada formula inline
            int totalNg       = ProductionCalculator.hitungTotalNg(production);
            int totalOutput   = ProductionCalculator.hitungOutput(production);
            int target        = ProductionCalculator.hitungTarget(production);
            int achievePct    = ProductionCalculator.hitungAchieve(totalOutput, target);
            String status     = ProductionCalculator.hitungStatus(totalOutput, target);
            String uptimeDisplay = ProductionCalculator.formatUptime(production.getUptimeMc());

            int ngRate = ProductionCalculator.hitungNgRate(production);

            Row row = sheet.createRow(rowIndex++);

            row.createCell(0).setCellValue(
                    production.getProduct().getCustomer().getCustomer()
            );
            row.createCell(1).setCellValue(
                    production.getProduct().getPartNo()
            );
            row.createCell(2).setCellValue(
                    production.getProduct().getPartName()
            );
            row.createCell(3).setCellValue(
                    production.getMachine().getName()
            );
            row.createCell(4).setCellValue(
                    production.getShift()
            );
            row.createCell(5).setCellValue(
                    uptimeDisplay   // "2 jam 20 menit" — konsisten dengan response DTO
            );
            row.createCell(6).setCellValue(
                    production.getOperator1().getName()
            );
            row.createCell(7).setCellValue(
                    production.getOperator2() == null ? "" : production.getOperator2().getName()
            );
            row.createCell(8).setCellValue(
                    production.getOperator3() == null ? "" : production.getOperator3().getName()
            );
            row.createCell(9).setCellValue(
                    production.getQtyOk() != null ? production.getQtyOk() : 0
            );
            row.createCell(10).setCellValue(
                    production.getQtyWip() != null ? production.getQtyWip() : 0
            );
            row.createCell(11).setCellValue(target);
            row.createCell(12).setCellValue(totalNg);
            row.createCell(13).setCellValue(totalOutput);
            row.createCell(14).setCellValue(achievePct);   // sudah Math.floor, tanpa "%" — angka saja
            row.createCell(15).setCellValue(ngRate);        // sudah Math.floor, tanpa "%" — angka saja
            row.createCell(16).setCellValue(status);        // "Tercapai" / "Tidak Target"
            row.createCell(17).setCellValue(
                    production.getProductionLot().toString()
            );
            row.createCell(18).setCellValue(
                    production.getRemark() == null ? "" : production.getRemark()
            );
        }

        return workbook;
    }
}