package com.productionmonitoring.service;

import com.productionmonitoring.dto.*;
import com.productionmonitoring.entity.Machine;
import com.productionmonitoring.entity.NgDefect;
import com.productionmonitoring.entity.Operator;
import com.productionmonitoring.entity.Production;
import com.productionmonitoring.entity.Products;
import com.productionmonitoring.entity.QtyDefect;
import com.productionmonitoring.excel.ProductionExcelExporter;
import com.productionmonitoring.exception.ResourceNotFoundException;
import com.productionmonitoring.repository.MachineRepository;
import com.productionmonitoring.repository.NgDefectRepository;
import com.productionmonitoring.repository.OperatorRepository;
import com.productionmonitoring.repository.ProductRepository;
import com.productionmonitoring.repository.ProductionRepository;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.productionmonitoring.dto.ProductionFilterDTO;
import com.productionmonitoring.specification.ProductionSpecificationBuilder;


import java.util.ArrayList;
import java.util.List;


@Service
public class ProductionService {

    private final ProductionRepository productionRepository;
    private final ProductRepository productRepository;
    private final MachineRepository machineRepository;
    private final OperatorRepository operatorRepository;
    private final NgDefectRepository ngDefectRepository;
    private final ProductionSpecificationBuilder specificationBuilder;

    public ProductionService(
            ProductionRepository productionRepository,
            ProductRepository productRepository,
            MachineRepository machineRepository,
            OperatorRepository operatorRepository,
            NgDefectRepository ngDefectRepository,
            ProductionSpecificationBuilder specificationBuilder
    ) {
        this.productionRepository = productionRepository;
        this.productRepository = productRepository;
        this.machineRepository = machineRepository;
        this.operatorRepository = operatorRepository;
        this.ngDefectRepository = ngDefectRepository;
        this.specificationBuilder = specificationBuilder;
    }


    public Page<ProductionResponseDTO> lihatReport(
            ProductionFilterDTO filter,
            int halamanKe,
            int jumlahData

    ) {
        Pageable perHalaman = PageRequest.of(halamanKe, jumlahData, Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<Production> specification =
                specificationBuilder.build(filter);

        return productionRepository
                .findAll(specification, perHalaman)
                .map(this::toResponseDTO);
    }

    public Workbook exportExcel(ProductionFilterDTO filter) {

        Specification<Production> specification =
                specificationBuilder.build(filter);

        List<Production> productions;

        if (specification == null) {
            productions = productionRepository.findAll();
        } else {
            productions = productionRepository.findAll(specification);
        }

        ProductionExcelExporter exporter =
                new ProductionExcelExporter();

        return exporter.export(productions);
    }

    public ProductionResponseDTO tambahReport(ProductionRequestDTO inputUser) {

        Production production = new Production();
        isiDataProductionDariDTO(production, inputUser);

        return toResponseDTO(productionRepository.save(production));
    }

    public String hapusReport (Long id) {
        Production dataReport = productionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("data tidak ditemukan"));
        String namaProduk = dataReport.getProduct() != null ? dataReport.getProduct().getPartName() : "tanpa produk";
        productionRepository.delete(dataReport);
        return "laporan produksi " + namaProduk + " berhasil dihapus dari database!!!!";
    }


    public ProductionResponseDTO editReport (Long id, ProductionRequestDTO inputUser) {
        Production dataReport = productionRepository.findById(id) .orElseThrow(() -> new ResourceNotFoundException("data tidak ditemukan"));
        isiDataProductionDariDTO(dataReport, inputUser);
        return toResponseDTO(productionRepository.save(dataReport));

}

    private void isiDataProductionDariDTO(Production production, ProductionRequestDTO inputUser) {
        if (inputUser.getProductId() != null) {
            Products product = productRepository.findById(inputUser.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product tidak ditemukan"));
            production.setProduct(product);
        }

        if (inputUser.getMachineId() != null) {
            Machine machine = machineRepository.findById(inputUser.getMachineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Machine tidak ditemukan"));
            production.setMachine(machine);
        }


        if (inputUser.getOperator1Id() != null) {
            Operator operator1 = operatorRepository.findById(inputUser.getOperator1Id())
                    .orElseThrow(() -> new ResourceNotFoundException("Operator 1 tidak ditemukan"));
            production.setOperator1(operator1);
        }

        if (inputUser.getOperator2Id() != null) {
            Operator operator2 = operatorRepository.findById(inputUser.getOperator2Id())
                    .orElseThrow(() -> new ResourceNotFoundException("Operator 2 tidak ditemukan"));
            production.setOperator2(operator2);
        }

        if (inputUser.getOperator3Id() != null) {
            Operator operator3 = operatorRepository.findById(inputUser.getOperator3Id())
                    .orElseThrow(() -> new ResourceNotFoundException("Operator 3 tidak ditemukan"));
            production.setOperator3(operator3);
        }
        if (inputUser.getShift() != null) {
            production.setShift(inputUser.getShift());
        }

        if (inputUser.getUptimeMc() != null) production.setUptimeMc(inputUser.getUptimeMc());
        if (inputUser.getQtyOk() != null) production.setQtyOk(inputUser.getQtyOk());
        if (inputUser.getQtyWip() != null) production.setQtyWip(inputUser.getQtyWip());
        if (inputUser.getProductionLot() != null) production.setProductionLot(inputUser.getProductionLot());
        if (inputUser.getRemark() != null) production.setRemark(inputUser.getRemark());

        if (inputUser.getDefects() != null) {
            production.syncDefectsParent(toQtyDefects(inputUser.getDefects()));
        } else {
            production.syncDefectsParent();
        }
    }

    private List<QtyDefect> toQtyDefects(List<QtyDefectRequestDTO> inputDefects) {
        List<QtyDefect> defects = new ArrayList<>();

        for (QtyDefectRequestDTO inputDefect : inputDefects) {
            NgDefect ngDefect = ngDefectRepository.findById(inputDefect.getNgDefectId())
                    .orElseThrow(() -> new ResourceNotFoundException("NG defect tidak ditemukan"));

            QtyDefect defect = new QtyDefect();
            defect.setNgDefect(ngDefect);
            defect.setQtyNg(inputDefect.getQtyNg());
            defects.add(defect);
        }

        return defects;
    }

    private ProductionResponseDTO toResponseDTO(Production production) {
        ProductionResponseDTO dto = new ProductionResponseDTO();
        dto.setId(production.getId());
        dto.setUptimeMc(production.getUptimeMc());
        dto.setQtyOk(production.getQtyOk());
        dto.setQtyWip(production.getQtyWip());
        dto.setProductionLot(production.getProductionLot());
        dto.setCreatedAt(production.getCreatedAt());
        dto.setRemark(production.getRemark());
        dto.setShift(production.getShift());

        if (production.getProduct() != null) {
            dto.setProductId(production.getProduct().getId());
            dto.setPartNo(production.getProduct().getPartNo());
            dto.setPartName(production.getProduct().getPartName());

            dto.setCycleTime(production.getProduct().getCycleTime());
            dto.setCavity(production.getProduct().getCavity());
            dto.setTakeTime(production.getProduct().getTakeTime());
            dto.setStatus(production.getProduct().getStatus());
            if (production.getProduct().getCustomer() != null) {
                dto.setCustomerId(
                        production.getProduct().getCustomer().getId()
                );

                dto.setCustomerName(
                        production.getProduct().getCustomer().getCustomer()
                );
            }
        }

        if (production.getMachine() != null) {
            dto.setMachineId(production.getMachine().getId());
            dto.setMachineName(production.getMachine().getName());
        }

        if (production.getOperator1() != null) {
            dto.setOperator1Id(production.getOperator1().getId());
            dto.setOperator1Name(production.getOperator1().getName());
            dto.setGroub1(production.getOperator1().getGroub());
        }

        if (production.getOperator2() != null) {
            dto.setOperator2Id(production.getOperator2().getId());
            dto.setOperator2Name(production.getOperator2().getName());
            dto.setGroub2(production.getOperator2().getGroub());
        }

        if (production.getOperator3() != null) {
            dto.setOperator3Id(production.getOperator3().getId());
            dto.setOperator3Name(production.getOperator3().getName());
            dto.setGroub3(production.getOperator3().getGroub());
        }

        if (production.getDefects() != null) {
            dto.setDefects(production.getDefects().stream()
                    .map(this::toQtyDefectResponseDTO)
                    .toList());
        }

        return dto;
    }

    private QtyDefectResponseDTO toQtyDefectResponseDTO(QtyDefect defect) {
        QtyDefectResponseDTO dto = new QtyDefectResponseDTO();
        dto.setId(defect.getId());
        dto.setQtyNg(defect.getQtyNg());

        if (defect.getNgDefect() != null) {
            dto.setNgDefectId(defect.getNgDefect().getId());
            dto.setNgDefectName(defect.getNgDefect().getName());
        }

        return dto;
    }

}
