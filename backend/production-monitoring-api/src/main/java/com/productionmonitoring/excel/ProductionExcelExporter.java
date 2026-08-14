package com.productionmonitoring.excel;

import com.productionmonitoring.entity.Production;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;

import java.util.List;

public class ProductionExcelExporter {


    public Workbook export(List<Production> productions){

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Raw Production");
        Row judul = sheet.createRow(0);
        Row headerRow = sheet.createRow(1);
        headerRow.createCell(0).setCellValue("Customer");
        headerRow.createCell(1).setCellValue("Part No");
        headerRow.createCell(2).setCellValue("Part Name");
        headerRow.createCell(3).setCellValue("Machine");
        headerRow.createCell(4).setCellValue("Shift");
        headerRow.createCell(5).setCellValue("Up Time MC");
        headerRow.createCell(6).setCellValue("Operator 1");
        headerRow.createCell(7).setCellValue("Operator 2");
        headerRow.createCell(8).setCellValue("Operator 3");
        headerRow.createCell(9).setCellValue("Qty OK");
        headerRow.createCell(10).setCellValue("Qty WIP");
        headerRow.createCell(11).setCellValue("Target PPIC"); // rumus = 3600 / cycle time * cavity * (uptimeMC / 60 (karena harus convert dari menit ke jam))
        headerRow.createCell(12).setCellValue("Total NG");
        headerRow.createCell(13).setCellValue("Total Produksi"); // rumus = Qty ok + qty Wip + Total NG
        headerRow.createCell(14).setCellValue("Achievement"); // rumus = total Production / Target PPIC * 100 + "%"
        headerRow.createCell(15).setCellValue("NG Rate"); // rumus = Total NG / Total Production * 100 + "%"
        headerRow.createCell(16).setCellValue("Status"); // If Total Production <= Target PPIC ? "tidak Target" : "Tercapai"
        headerRow.createCell(17).setCellValue("Production Lot");
        headerRow.createCell(18).setCellValue("Remark");

        int rowNumber = 2;

        for (Production production : productions) {


            int totalNg = production.getDefects()
                    .stream()
                    .mapToInt(defect -> defect.getQtyNg())
                    .sum();

            double targetPpic =
                    (3600 / production.getProduct().getCycleTime())
                            * production.getProduct().getCavity()
                            * (production.getUptimeMc() / 60);

            Row row = sheet.createRow(rowNumber++);
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
                    production.getUptimeMc()
            );

            row.createCell(6).setCellValue(
                    production.getOperator1().getName()
            );

            row.createCell(7).setCellValue(
                    production.getOperator2() == null
                            ? ""
                            : production.getOperator2().getName()
            );

            row.createCell(8).setCellValue(
                    production.getOperator3() == null
                            ? ""
                            : production.getOperator3().getName()
            );

            row.createCell(9).setCellValue(
                    production.getQtyOk()
            );

            row.createCell(10).setCellValue(
                    production.getQtyWip()
            );

            row.createCell(11).setCellValue(targetPpic);

            row.createCell(12).setCellValue(totalNg);

            Cell totalProductionCell = row.createCell(13);

            totalProductionCell.setCellFormula(
                    "J" + (rowNumber) +
                            "+K" + (rowNumber) +
                            "+M" + (rowNumber)
            );

            Cell achievementCell = row.createCell(14);

            achievementCell.setCellFormula(
                    "N" + rowNumber +
                            "/L" + rowNumber
            );

            Cell ngRateCell = row.createCell(15);

            ngRateCell.setCellFormula(
                    "M" + rowNumber +
                            "/N" + rowNumber
            );

            Cell statusCell = row.createCell(16);

            statusCell.setCellFormula(
                    "IF(N" + rowNumber +
                            ">=L" + rowNumber +
                            ",\"TERCAPAI\",\"TIDAK TERCAPAI\")"
            );


            row.createCell(17).setCellValue(
                    production.getProductionLot().toString()
            );

            row.createCell(18).setCellValue(
                    production.getRemark() == null
                            ? ""
                            : production.getRemark()
            );


        }

        return workbook;

    }

}