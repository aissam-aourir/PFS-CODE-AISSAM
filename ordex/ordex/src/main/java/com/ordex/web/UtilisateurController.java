package com.ordex.web;

import com.ordex.security.entities.Utilisateur;
import com.ordex.security.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/clients")
@AllArgsConstructor
public class UtilisateurController {

    private final AccountService accountService;

    // Get all clients
    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllClients() {
        List<Utilisateur> clients = accountService.getAllClients();
        return ResponseEntity.ok(clients);
    }
}
