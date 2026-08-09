package com.productionmonitoring.controller;

import com.productionmonitoring.entity.NgDefect;
import com.productionmonitoring.exception.ResourceNotFoundException;
import com.productionmonitoring.repository.NgDefectRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ng-defects")
@CrossOrigin
public class NgDefectController {

    private final NgDefectRepository ngDefectRepository;

    public NgDefectController(NgDefectRepository ngDefectRepository) {
        this.ngDefectRepository = ngDefectRepository;
    }

    @GetMapping
    public List<NgDefect> lihatSemuaNgDefect() {
        return ngDefectRepository.findAll();
    }

    @PostMapping
    public NgDefect tambahNgDefect(@Valid @RequestBody NgDefect inputUser) {
        return ngDefectRepository.save(inputUser);
    }

    @PutMapping("/{id}")
    public NgDefect editNgDefect(@PathVariable Long id, @Valid @RequestBody NgDefect inputUser) {
        NgDefect ngDefect = ngDefectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NG defect tidak ditemukan"));

        ngDefect.setName(inputUser.getName());
        ngDefect.setDescription(inputUser.getDescription());
        return ngDefectRepository.save(ngDefect);
    }

    @DeleteMapping("/{id}")
    public String hapusNgDefect(@PathVariable Long id) {
        NgDefect ngDefect = ngDefectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NG defect tidak ditemukan"));

        String namaNgDefect = ngDefect.getName();
        ngDefectRepository.delete(ngDefect);
        return "NG defect " + namaNgDefect + " berhasil dihapus";
    }
}
