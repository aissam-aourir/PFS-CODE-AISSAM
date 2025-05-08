package com.ordex.services.implementations;

import com.ordex.entities.Product;
import com.ordex.repository.ProductRepository;
import com.ordex.services.interfaces.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    private final ProductRepository productRepository;

    @Override
    public Product save(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    public Product update(Long id, Product product) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setStock(product.getStock());
        existing.setImageURL(product.getImageURL());
        existing.setCategory(product.getCategory());
        // Explicitly update the isValidByAdmin field if it's provided
        if (product.getIsValidByAdmin() != null) {
            existing.setIsValidByAdmin(product.getIsValidByAdmin());
        }
        return productRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public List<Product> getAll() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    // New method to get products by supplier ID
    public List<Product> getBySupplierId(Long userId) {
        return productRepository.findBySupplier_UserId(userId);
    }

    public List<Product> getValidProducts() {
        return productRepository.findByIsValidByAdminTrue();
    }


}
