package com.productionmonitoring.service;

import com.productionmonitoring.dto.ProductRequestDTO;
import com.productionmonitoring.dto.ProductResponseDTO;
import com.productionmonitoring.entity.Customer;
import com.productionmonitoring.entity.Products;
import com.productionmonitoring.exception.ResourceNotFoundException;
import com.productionmonitoring.repository.CustomerRepository;
import com.productionmonitoring.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public ProductService(
            ProductRepository productRepository,
            CustomerRepository customerRepository
    ) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    public Page<ProductResponseDTO> lihatSemuaProduct(int halamanKe, int jumlahData) {
        Pageable perHalaman = PageRequest.of(halamanKe, jumlahData);
        return productRepository.findAll(perHalaman).map(this::toResponseDTO);
    }

    public ProductResponseDTO tambahProduct(ProductRequestDTO inputUser) {

        Customer customer = customerRepository.findById(inputUser.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer tidak ditemukan"));

        Products product = new Products();

        product.setPartNo(inputUser.getPartNo());
        product.setPartName(inputUser.getPartName());
        product.setColor(inputUser.getColor());
        product.setCycleTime(inputUser.getCycleTime());
        product.setCavity(inputUser.getCavity());
        product.setTakeTime(inputUser.getTakeTime());
        product.setCustomer(customer);

        return toResponseDTO(productRepository.save(product));
    }

    private ProductResponseDTO toResponseDTO(Products product) {

        ProductResponseDTO dto = new ProductResponseDTO();

        dto.setId(product.getId());
        dto.setPartNo(product.getPartNo());
        dto.setPartName(product.getPartName());
        dto.setColor(product.getColor());
        dto.setCycleTime(product.getCycleTime());
        dto.setCavity(product.getCavity());
        dto.setTakeTime(product.getTakeTime());

        if (product.getCustomer() != null) {
            dto.setCustomerId(product.getCustomer().getId());
            dto.setCustomerName(product.getCustomer().getCustomer());
        }

        return dto;
    }
    public ProductResponseDTO editProduct(Long id, ProductRequestDTO inputUser) {

        Products product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product tidak ditemukan"));

        Customer customer = customerRepository.findById(inputUser.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer tidak ditemukan"));

        product.setPartNo(inputUser.getPartNo());
        product.setPartName(inputUser.getPartName());
        product.setColor(inputUser.getColor());
        product.setCycleTime(inputUser.getCycleTime());
        product.setCavity(inputUser.getCavity());
        product.setTakeTime(inputUser.getTakeTime());
        product.setCustomer(customer);

        return toResponseDTO(productRepository.save(product));
    }
    public String hapusProduct(Long id) {

        Products product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product tidak ditemukan"));

        String namaProduct = product.getPartName();

        productRepository.delete(product);

        return "Product " + namaProduct + " berhasil dihapus";
    }
    public List<ProductResponseDTO> cariProduct(String keyword) {

        return productRepository
                .findByPartNoContainingIgnoreCaseOrPartNameContainingIgnoreCase(
                        keyword,
                        keyword
                )
                .stream()
                .map(this::toProductResponseDTO)
                .toList();
    }
    private ProductResponseDTO toProductResponseDTO(Products product) {

        ProductResponseDTO dto = new ProductResponseDTO();

        dto.setId(product.getId());
        dto.setPartNo(product.getPartNo());
        dto.setPartName(product.getPartName());
        dto.setColor(product.getColor());
        dto.setCycleTime(product.getCycleTime());
        dto.setCavity(product.getCavity());
        dto.setTakeTime(product.getTakeTime());

        if (product.getCustomer() != null) {
            dto.setCustomerId(product.getCustomer().getId());
            dto.setCustomerName(product.getCustomer().getCustomer());
        }

        return dto;
    }
}
