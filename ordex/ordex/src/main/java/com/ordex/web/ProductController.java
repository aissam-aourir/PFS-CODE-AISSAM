package com.ordex.web;

import com.ordex.entities.Product;
import com.ordex.security.entities.Utilisateur;
import com.ordex.security.service.AccountServiceImpl;
import com.ordex.services.implementations.ProductService;
import com.ordex.services.interfaces.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController extends AbstractCrudController<Product, Long> {

    private final IProductService productService;
    private final AccountServiceImpl accountService;


    @Override
    protected IProductService getService() {
        return productService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            if (product.getSupplier() != null && product.getSupplier().getUserId() != null) {
                Utilisateur supplier = accountService.findById(product.getSupplier().getUserId());
                if (supplier == null) {
                    return ResponseEntity
                            .status(HttpStatus.BAD_REQUEST)
                            .body("Supplier not found with ID: " + product.getSupplier().getUserId());
                }
                product.setSupplier(supplier);
            } else {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Supplier ID is required");
            }

            product.setCreatedAt(LocalDateTime.now()); // Set server-side
            product.setIsValidByAdmin(false); // Enforce business rule

            Product savedProduct = productService.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the product: " + e.getMessage());
        }
    }

    @GetMapping("/by-supplier/{supplierId}")
    public ResponseEntity<?> getProductsBySupplier(@PathVariable Long supplierId) {
        List<Product> products = productService.getBySupplierId(supplierId);
        if (products.isEmpty()) {
            // Returning a custom message with NOT_FOUND status
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No products found");
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/valid")
    public ResponseEntity<List<Product>> getValidProducts() {
        return ResponseEntity.ok(productService.getValidProducts());
    }




}
