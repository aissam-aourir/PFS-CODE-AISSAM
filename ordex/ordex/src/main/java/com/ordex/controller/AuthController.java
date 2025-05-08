package com.ordex.controller;

import com.ordex.services.implementations.EmailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200") // Autorise le frontend
public class AuthController {

    @Autowired
    private EmailServiceImpl emailService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
System.out.println("email saisi : " + email);
        if (email == null || email.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email requis");
            return ResponseEntity.badRequest().body(response);
        }

        // Générer un code de réinitialisation (6 chiffres)
        String resetCode = String.format("%06d", new Random().nextInt(999999));
System.out.println("Code de réinitialisation généré : " + resetCode);
        try {
System.out.println("Envoi de l'email à : " + email);
            emailService.sendResetCode(email, resetCode);
            //cette requete de emailService.sendResetCode(email, resetCode); ne s'execute pas
            Map<String, String> response = new HashMap<>();
            response.put("message", "Code de réinitialisation envoyé");
System.out.println("Email envoyé avec succès à : " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Échec de l'envoi de l'email : " + e.getMessage());
System.out.println("Erreur lors de l'envoi de l'email : ");
            return ResponseEntity.status(500).body(response);
        }
    }

    // Autres méthodes (login, register) existantes
}