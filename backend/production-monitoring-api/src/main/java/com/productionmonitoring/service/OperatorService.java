package com.productionmonitoring.service;

import com.productionmonitoring.entity.Operator;
import com.productionmonitoring.repository.OperatorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperatorService {

    private final OperatorRepository operatorRepository;

    public OperatorService(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }

    public List<Operator> cariOperator(String keyword) {

        return operatorRepository
                .findByNameContainingIgnoreCaseOrNikContainingIgnoreCase(
                        keyword,
                        keyword
                );
    }
    public Page<Operator> lihatOperator(
            int halamanKe,
            int jumlahData,
            String keyword,
            String groub
    ) {
        Pageable halaman = PageRequest.of(halamanKe, jumlahData);

        return operatorRepository.searchOperator(
                keyword,
                groub,
                halaman
        );
    }

    public Operator tambahOperator(Operator input) {
        return operatorRepository.save(input);
    }
    public Operator editOperator(Long id, Operator input) {

        Operator operator = operatorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Operator tidak ditemukan"));

        operator.setName(input.getName());
        operator.setNik(input.getNik());
        operator.setGroub(input.getGroub());

        return operatorRepository.save(operator);
    }

    public String hapusOperator(Long id) {

        Operator operator = operatorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Operator tidak ditemukan"));

        operatorRepository.delete(operator);

        return "Operator berhasil dihapus";
    }
}