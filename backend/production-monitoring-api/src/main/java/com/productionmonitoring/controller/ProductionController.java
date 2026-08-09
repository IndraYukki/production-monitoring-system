package com.productionmonitoring.controller;


import com.productionmonitoring.dto.ProductionFilterDTO;
import com.productionmonitoring.dto.ProductionRequestDTO;
import com.productionmonitoring.dto.ProductionResponseDTO;
import com.productionmonitoring.service.ProductionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayOutputStream;
import java.io.IOException;


@RestController
@RequestMapping("/api/production")
@CrossOrigin
public class ProductionController {

    private final ProductionService productionService;

    public ProductionController(ProductionService productionService) {
        this.productionService = productionService;
    }

    @GetMapping
    public Page<ProductionResponseDTO> lihatLaporan(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            Long customerId,

            @RequestParam(defaultValue = "0")
            int halaman,

            @RequestParam(defaultValue = "70")
            int jumlah,

            @RequestParam(required = false)
            Long machineId,

            @RequestParam(required = false)
            String shift,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate tanggalMulai,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate tanggalSelesai

    ) {

        ProductionFilterDTO filter =
                new ProductionFilterDTO();

        filter.setKeyword(keyword);
        filter.setCustomerId(customerId);
        filter.setMachineId(machineId);
        filter.setShift(shift);
        filter.setTanggalMulai(tanggalMulai);
        filter.setTanggalSelesai(tanggalSelesai);

        return productionService.lihatReport(
                filter,
                halaman,
                jumlah
        );
    }

    // gerbang untuk export tanpa list
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long machineId,
            @RequestParam(required = false) String shift,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate tanggalMulai,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate tanggalSelesai
    ) throws IOException {

        ProductionFilterDTO filter = new ProductionFilterDTO();
        filter.setKeyword(keyword);
        filter.setCustomerId(customerId);
        filter.setMachineId(machineId);
        filter.setShift(shift);
        filter.setTanggalMulai(tanggalMulai);
        filter.setTanggalSelesai(tanggalSelesai);

        Workbook workbook = productionService.exportExcel(filter);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        workbook.write(outputStream);
        workbook.close();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"Raw Production.xlsx\""
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(outputStream.toByteArray());
    }


    @PostMapping
    public ProductionResponseDTO tambahLaporan (@Valid @RequestBody ProductionRequestDTO inputUser) {
        return productionService.tambahReport(inputUser);
    }

    @DeleteMapping("/{idInput}")
    public String hapusLaporan (@PathVariable Long idInput) {
        return productionService.hapusReport(idInput);
    }

    @PutMapping("/{idInput}")
    public ProductionResponseDTO editReport (@PathVariable Long idInput,@Valid @RequestBody ProductionRequestDTO inputUser) {
        return productionService.editReport(idInput, inputUser);
    }




}
