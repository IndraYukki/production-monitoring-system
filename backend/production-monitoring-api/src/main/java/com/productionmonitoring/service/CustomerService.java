package com.productionmonitoring.service;

import com.productionmonitoring.entity.Customer;
import com.productionmonitoring.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> lihatCustomer() {
        return customerRepository.findAll();
    }

    public Customer tambahCustomer(Customer input) {
        return customerRepository.save(input);
    }

    public Customer editCustomer(Long id, Customer input) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer tidak ditemukan"));

        customer.setCustomer(input.getCustomer());

        return customerRepository.save(customer);
    }

    public void hapusCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer tidak ditemukan"));

        customerRepository.delete(customer);
    }
}