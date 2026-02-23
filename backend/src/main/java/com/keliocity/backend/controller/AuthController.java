package com.keliocity.backend.controller;

import com.keliocity.backend.model.dto.AuthResponse;
import com.keliocity.backend.model.dto.DeskAssignDTO;
import com.keliocity.backend.model.dto.LoginDTO;
import com.keliocity.backend.model.dto.RegisterDTO;
import com.keliocity.backend.repository.AccountRepository;
import com.keliocity.backend.service.AuthService;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final AccountRepository accountRepo;

    public AuthController(AuthService authService,AccountRepository accountRepo){
        this.authService = authService;
        this.accountRepo = accountRepo;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginDTO accDTO){
        /*String token = authService.login(accDTO);
        return new AuthResponse(token, "Bearer");*/
    	return authService.login(accDTO);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse  register(@RequestBody RegisterDTO accDTO) {
        /*String token = authService.register(accDTO);
        return new AuthResponse(token, "Bearer");*/
    	return authService.register(accDTO);
    }
    
    @PutMapping("/me/desk")
    public void assignMyDesk(@RequestBody DeskAssignDTO dto, Principal principal) {
    	String email = principal.getName(); 
    	authService.assignDesk(email, dto.deskId());
    }
}
