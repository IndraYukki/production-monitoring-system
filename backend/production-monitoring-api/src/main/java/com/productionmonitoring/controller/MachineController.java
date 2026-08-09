package com.productionmonitoring.controller;

import com.productionmonitoring.entity.Machine;
import com.productionmonitoring.exception.ResourceNotFoundException;
import com.productionmonitoring.repository.MachineRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
@CrossOrigin
public class MachineController {

    private final MachineRepository machineRepository;

    public MachineController(MachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }

    @GetMapping
    public List<Machine> lihatSemuaMachine() {
        return machineRepository.findAll();
    }

    @PostMapping
    public Machine tambahMachine(@Valid @RequestBody Machine inputUser) {
        return machineRepository.save(inputUser);
    }

    @PutMapping("/{id}")
    public Machine editMachine(@PathVariable Long id, @Valid @RequestBody Machine inputUser) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Machine tidak ditemukan"));

        machine.setName(inputUser.getName());
        return machineRepository.save(machine);
    }

    @DeleteMapping("/{id}")
    public String hapusMachine(@PathVariable Long id) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Machine tidak ditemukan"));

        String namaMachine = machine.getName();
        machineRepository.delete(machine);
        return "Machine " + namaMachine + " berhasil dihapus";
    }
}
