package com.productionmonitoring.excel;

import com.productionmonitoring.util.ProductionCalculator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import java.util.Iterator;
import java.util.stream.Stream;

public class ProductionExcelExporter {

    /**
     * Membangun workbook Excel dari baris proyeksi database (Object[]),
     * BUKAN dari entity Production.
     *
     * Urutan kolom Object[] (dari ProductionRepository.findRowsForExport):
     * [0]  customer_name,  [1] part_no,       [2] part_name,     [3] machine_name,
     * [4]  shift,          [5] uptime_mc,     [6] operator1_name,
     * [7]  operator2_name, [8] operator3_name, [9] qty_ok,       [10] qty_wip,
     * [11] target,         [12] total_ng,     [13] total_output,
     * [14] production_lot, [15] remark
     *
     * Achieve %, NG Rate %, dan Status dihitung di sini lewat
     * ProductionCalculator (overload agregat) — TIDAK diduplikasi di SQL.
     */
    public Workbook export(Stream<Object[]> rows) {

        // SXSSFWorkbook hanya menyimpan sebagian baris di memori,
        // sisanya ditulis ke file sementara — aman untuk ratusan ribu baris.
        SXSSFWorkbook workbook = new SXSSFWorkbook(100);
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
        Iterator<Object[]> iterator = rows.iterator();

        while (iterator.hasNext()) {
            Object[] r = iterator.next();

            // Semua kalkulasi via ProductionCalculator — tidak ada formula inline
            long target      = ((Number) r[11]).longValue();
            long totalNg     = ((Number) r[12]).longValue();
            long totalOutput = ((Number) r[13]).longValue();

            double achievePct = ProductionCalculator.hitungAchieve(totalOutput, target);
            double ngRate     = ProductionCalculator.hitungNgRate(totalNg, totalOutput);
            String status     = ProductionCalculator.hitungStatus((int) totalOutput, (int) target);
            String uptimeDisplay = ProductionCalculator.formatUptime(((Number) r[5]).intValue());

            Row row = sheet.createRow(rowIndex++);

            row.createCell(0).setCellValue(r[0] == null ? "" : (String) r[0]);
            row.createCell(1).setCellValue(r[1] == null ? "" : (String) r[1]);
            row.createCell(2).setCellValue(r[2] == null ? "" : (String) r[2]);
            row.createCell(3).setCellValue(r[3] == null ? "" : (String) r[3]);
            row.createCell(4).setCellValue(r[4] == null ? "" : (String) r[4]);
            row.createCell(5).setCellValue(
                    uptimeDisplay   // "2 jam 20 menit" — konsisten dengan response DTO
            );
            row.createCell(6).setCellValue(r[6] == null ? "" : (String) r[6]);
            row.createCell(7).setCellValue(r[7] == null ? "" : (String) r[7]);
            row.createCell(8).setCellValue(r[8] == null ? "" : (String) r[8]);
            row.createCell(9).setCellValue(((Number) r[9]).doubleValue());
            row.createCell(10).setCellValue(((Number) r[10]).doubleValue());
            row.createCell(11).setCellValue((double) target);
            row.createCell(12).setCellValue((double) totalNg);
            row.createCell(13).setCellValue((double) totalOutput);
            row.createCell(14).setCellValue(achievePct);   // sudah 2 desimal, tanpa "%" — angka saja
            row.createCell(15).setCellValue(ngRate);        // sudah 2 desimal, tanpa "%" — angka saja
            row.createCell(16).setCellValue(status);        // "Tercapai" / "Tidak Target"
            row.createCell(17).setCellValue(
                    r[14] == null ? "" : r[14].toString()
            );
            row.createCell(18).setCellValue(
                    r[15] == null ? "" : (String) r[15]
            );
        }

        return workbook;
    }
}
