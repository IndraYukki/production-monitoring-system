package com.productionmonitoring.controller;

import com.productionmonitoring.entity.Customer;
import com.productionmonitoring.service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> lihatCustomer() {
        return customerService.lihatCustomer();
    }

    @PostMapping
    public Customer tambahCustomer(
            @RequestBody Customer input
    ) {
        return customerService.tambahCustomer(input);
    }

    @PutMapping("/{id}")
    public Customer editCustomer(
            @PathVariable Long id,
            @RequestBody Customer input
    ) {
        return customerService.editCustomer(id, input);
    }

    @DeleteMapping("/{id}")
    public String hapusCustomer(
            @PathVariable Long id
    ) {
        customerService.hapusCustomer(id);

        return "Customer berhasil dihapus";
    }
}