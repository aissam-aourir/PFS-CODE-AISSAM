package com.ordex.security.repository;

import com.ordex.security.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    // You can add custom query methods like:
    Utilisateur findByUsername(String username);
}
