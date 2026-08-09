package com.productionmonitoring.controller;

import com.productionmonitoring.entity.Operator;
import com.productionmonitoring.exception.ResourceNotFoundException;
import com.productionmonitoring.repository.OperatorRepository;
import com.productionmonitoring.service.OperatorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operators")
@CrossOrigin
public class OperatorController {

    private final OperatorRepository operatorRepository;
    private final OperatorService operatorService;

    public OperatorController(OperatorRepository operatorRepository, OperatorService operatorService) {
        this.operatorRepository = operatorRepository;
        this.operatorService = operatorService;

    }
    @GetMapping("/search")
    public List<Operator> cariOperator(
            @RequestParam String keyword
    ) {
        return operatorService.cariOperator(keyword);
    }

    @GetMapping
    public List<Operator> lihatSemuaOperator() {
        return operatorRepository.findAll();
    }

    @PostMapping
    public Operator tambahOperator(@Valid @RequestBody Operator inputUser) {
        return operatorRepository.save(inputUser);
    }


    @PutMapping("/{id}")
    public Operator editOperator(@PathVariable Long id, @Valid @RequestBody Operator inputUser) {
        Operator operator = operatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Operator tidak ditemukan"));

        operator.setName(inputUser.getName());
        operator.setNik(inputUser.getNik());
        operator.setGroub(inputUser.getGroub());
        return operatorRepository.save(operator);
    }

    @DeleteMapping("/{id}")
    public String hapusOperator(@PathVariable Long id) {
        Operator operator = operatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Operator tidak ditemukan"));

        String namaOperator = operator.getName();
        operatorRepository.delete(operator);
        return "Operator " + namaOperator + " berhasil dihapus";
    }
}
