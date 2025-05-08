package com.ordex.security.service;

import com.ordex.security.entities.Utilisateur;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    @Lazy
    private final AccountService accountService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur user = accountService.loadUserByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException(String.format("User %s not found", username));
        }

        // Debug: Print roles
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            System.out.println("No roles assigned to user: " + username);
        } else {
            user.getRoles().forEach(role -> System.out.println("Role: " + role.getRole()));
        }

        // Map roles to authorities
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority(r.getRole()))
                .collect(Collectors.toList());

        return User.withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }


}
