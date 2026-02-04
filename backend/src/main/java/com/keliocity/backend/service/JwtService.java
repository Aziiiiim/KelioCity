package com.keliocity.backend.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import com.keliocity.backend.model.Account;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final String issuer;
    private final long expMinutes;

    public JwtService(JwtEncoder jwtEncoder,@Value("${security.jwt.issuer}") String issuer,@Value("${security.jwt.exp-minutes}") long expMinutes) {
        this.jwtEncoder = jwtEncoder;
        this.issuer = issuer;
        this.expMinutes = expMinutes;
    }

    public String generateToken(Account account) {
        Instant now = Instant.now();
        Map<String, Object> claims = Map.of(
                "role", account.getRole().name(),
                "email", account.getEmail()
        );

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(now.plus(expMinutes, ChronoUnit.MINUTES))
                .subject(String.valueOf(account.getId()))
                .claims(c -> c.putAll(claims))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
    }
}
