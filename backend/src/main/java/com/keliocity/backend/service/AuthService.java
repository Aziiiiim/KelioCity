package com.keliocity.backend.service;

import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.keliocity.backend.model.Account;
import com.keliocity.backend.model.AccountRole;
import com.keliocity.backend.model.dto.AccountDTO;
import com.keliocity.backend.repository.AccountRepository;

@Service
public class AuthService {
    
    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AccountRepository accountRepo, PasswordEncoder passwordEncoder, JwtService jwtService){
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public String register(AccountDTO accDTO){
        if (accountRepo.existsByEmail(accDTO.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email déjà utilisé");
        }

        if(!isValidEmail(accDTO.email())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email invalide");
        }
        if(!isValidPassword(accDTO.password())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mot de passe invalide");
        }
        Account acc = new Account();
        acc.setEmail(accDTO.email());
        acc.setPassword(passwordEncoder.encode(accDTO.password()));
        acc.setRole(AccountRole.USER);
        try {
            accountRepo.save(acc);
            String token = jwtService.generateToken(acc);
            return token;
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email déjà utilisé");
        }
    }

    private boolean isValidEmail(String email){
        return true;
    }
    private boolean isValidPassword(String password){
        return true;
    }

    public String login(AccountDTO accDTO){
        Optional<Account> res = accountRepo.findByEmail(accDTO.email());
        if (res.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email et/ou mot de passe incorrect(s)");
        }
        else{
            if(passwordEncoder.matches(accDTO.password(),res.get().getPassword())){
                String token = jwtService.generateToken(res.get());
                return token;
            }
            else{
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email et/ou mot de passe incorrect(s)");
            }
        }
        
    }
}
