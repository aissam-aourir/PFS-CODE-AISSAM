package com.ordex.security.service;

import com.ordex.security.entities.AppRole;
import com.ordex.security.entities.Utilisateur;
import com.ordex.security.repository.AppRoleRepository;
import com.ordex.security.repository.UtilisateurRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public  class AccountServiceImpl implements AccountService {

    private final UtilisateurRepository utilisateurRepository;
    private final AppRoleRepository appRoleRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public Utilisateur addNewUser(String username, String password, String email) {
        Utilisateur user = utilisateurRepository.findByUsername(username);
        if(user!=null) throw new RuntimeException("this user is already exist");
        user = Utilisateur.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .roles(new ArrayList<>())
                .createdAt(LocalDateTime.now(ZoneId.systemDefault()))
                .build();

        return utilisateurRepository.save(user);    }

    @Override
    public AppRole addNewRole(String role) {
        AppRole appRole = appRoleRepository.findById(role).orElse(null);
        if(appRole!=null) throw new RuntimeException("this role is already exist");
        appRole = AppRole.builder()
                .role(role)
                .build();
        return appRoleRepository.save(appRole);
    }

    @Override
    public void addRoleToUser(String username, String role) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username);
        AppRole appRole = appRoleRepository.findById(role).get();

        utilisateur.getRoles().add(appRole);
//        utilisateurRepository.save(utilisateur);
    }

    @Override
    public Utilisateur loadUserByUsername(String username) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username);
        if (utilisateur == null) {
            throw new UsernameNotFoundException("User not found");
        }
        System.out.println("Roles loaded for user: " + username + " -> " + utilisateur.getRoles());
        return utilisateur;
    }

    @Override
    public Utilisateur findById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur not found with id: " + id));
    }




    @Override
    public List<Utilisateur> getAllSuppliers() {
        return getUsersByRole("SUPPLIER");
    }

    @Override
    public List<Utilisateur> getAllClients() {
        return getUsersByRole("CLIENT");
    }


    private List<Utilisateur> getUsersByRole(String role) {
        List<Utilisateur> users = utilisateurRepository.findAll()
                .stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> role.equals(r.getRole())))
                .toList();

        // Reverse the list to get the most recent ones first
        List<Utilisateur> reversed = new ArrayList<>(users);
        Collections.reverse(reversed);

        return reversed;
    }


    public Utilisateur blockUser(String username) {
        // Directly check if the user is null
        Utilisateur user = utilisateurRepository.findByUsername(username);
        if (user == null) {
            // If user is not found, throw an exception
            throw new RuntimeException("User not found");
        }
        // Set user as blocked
        user.setBlocked(true);
        // Save and return updated user
        return utilisateurRepository.save(user);
    }

    public Utilisateur unblockUser(String username) {
        // Directly check if the user is null
        Utilisateur user = utilisateurRepository.findByUsername(username);
        if (user == null) {
            // If user is not found, throw an exception
            throw new RuntimeException("User not found");
        }
        // Set user as unblocked
        user.setBlocked(false);
        // Save and return updated user
        return utilisateurRepository.save(user);
    }



}
