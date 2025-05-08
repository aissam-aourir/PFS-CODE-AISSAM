package com.ordex.security.helpers;

import com.ordex.security.entities.Utilisateur;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtEncoder jwtEncoder;

    public String generateToken(Authentication authentication, Utilisateur user) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(now.plus(2, ChronoUnit.HOURS))
                .subject(user.getUsername())
                .claim("email", user.getEmail())
                .claim("userId", user.getUserId())
                .claim("authorities", authentication.getAuthorities().stream()
                        .map(a -> a.getAuthority())
                        .collect(Collectors.toList()))
                .build();

        JwtEncoderParameters params = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS512).build(), claims);

        return jwtEncoder.encode(params).getTokenValue();
    }
}
