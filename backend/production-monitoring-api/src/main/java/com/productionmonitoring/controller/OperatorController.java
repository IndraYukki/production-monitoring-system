package com.productionmonitoring.controller;

import com.productionmonitoring.entity.Operator;
import com.productionmonitoring.exception.ResourceNotFoundException;
import com.productionmonitoring.repository.OperatorRepository;
import com.productionmonitoring.service.OperatorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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
    public Page<Operator> lihatSemua(
            @RequestParam(defaultValue = "0") int halaman,
            @RequestParam(defaultValue = "10") int jumlah,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String groub
    ) {
        return operatorService.lihatOperator(
                halaman,
                jumlah,
                keyword,
                groub
        );
    }

    @PostMapping
    public Operator tambahOperator(@Valid @RequestBody Operator inputUser) {
        return operatorService.tambahOperator(inputUser);
    }


    @PutMapping("/{id}")
    public Operator editOperator(
            @PathVariable Long id,
            @Valid @RequestBody Operator input) {

        return operatorService.editOperator(id, input);
    }

    @DeleteMapping("/{id}")
    public String hapusOperator(@PathVariable Long id) {
        return operatorService.hapusOperator(id);
    }
}
