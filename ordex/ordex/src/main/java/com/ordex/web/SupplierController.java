package com.ordex.web;


import com.ordex.helpers.RegisterRequest;
import com.ordex.security.entities.Utilisateur;
import com.ordex.security.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/suppliers")
@AllArgsConstructor
public class SupplierController {
    private final AccountService accountService;
    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Utilisateur user = accountService.addNewUser(
                    request.getUsername(),
                    request.getPassword(),
                    request.getEmail()
            );
            // Assign default role (e.g. CLIENT)
            accountService.addRoleToUser(user.getUsername(), "SUPPLIER");

            return ResponseEntity.ok(Map.of("message", "SUPPLIER registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSuppliers() {
        return ResponseEntity.ok(accountService.getAllSuppliers());
    }
}
