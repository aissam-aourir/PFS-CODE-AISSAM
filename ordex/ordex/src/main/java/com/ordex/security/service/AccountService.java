package com.ordex.security.service;

import com.ordex.security.entities.AppRole;
import com.ordex.security.entities.Utilisateur;

import java.util.List;

public interface AccountService {

    Utilisateur addNewUser(String username, String password, String email);
    AppRole addNewRole(String role);
    void addRoleToUser(String username,String role);
    Utilisateur loadUserByUsername(String username);
    Utilisateur findById(Long Id);
    List<Utilisateur> getAllSuppliers();
    List<Utilisateur> getAllClients();
}
