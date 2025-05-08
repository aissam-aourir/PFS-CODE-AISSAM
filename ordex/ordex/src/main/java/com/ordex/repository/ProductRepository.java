package com.ordex.repository;

import com.ordex.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByCreatedAtDesc();
    List<Product> findBySupplier_UserId(Long userId);
    List<Product> findByIsValidByAdminTrue();

}
