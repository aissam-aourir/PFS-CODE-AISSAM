package com.ordex.security;

import com.ordex.helpers.LoginRequest;
import com.ordex.helpers.RegisterRequest;
import com.ordex.security.entities.Utilisateur;
import com.ordex.security.helpers.JwtService;
import com.ordex.security.service.AccountServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class SecurityController {

    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final AccountServiceImpl accountService;
    private final JwtService jwtService;



    @GetMapping("/profile")
    public Authentication authentication (Authentication authentication){
        return authentication;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(), loginRequest.getPassword()));

            Utilisateur user = accountService.loadUserByUsername(loginRequest.getUsername());

            // Check if the user is blocked
            if (user.isBlocked()) {
                return ResponseEntity.status(403).body(Map.of("error", "User is blocked"));
            }

            String jwt = jwtService.generateToken(authentication, user);

            return ResponseEntity.ok(Map.of("access-token", jwt));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }





    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Utilisateur user = accountService.addNewUser(
                    request.getUsername(), request.getPassword(), request.getEmail());

            accountService.addRoleToUser(user.getUsername(), "CLIENT");

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(), request.getPassword()));

            String jwt = jwtService.generateToken(authentication, user);
            return ResponseEntity.ok(Map.of("access-token", jwt));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/block/{username}")
    public ResponseEntity<?> blockUser(@PathVariable String username) {
        try {
            Utilisateur blockedUser = accountService.blockUser(username);
            return ResponseEntity.ok(Map.of("message", "User blocked successfully", "user", blockedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/unblock/{username}")
    public ResponseEntity<?> unblockUser(@PathVariable String username) {
        try {
            Utilisateur unblockedUser = accountService.unblockUser(username);
            return ResponseEntity.ok(Map.of("message", "User unblocked successfully"));
        } catch (RuntimeException e) {
//            System.out.println("Message is "+e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }






}
