package com.keliocity.backend.controller;

import com.keliocity.backend.model.dto.AccountDTO;
import com.keliocity.backend.model.dto.AuthResponse;
import com.keliocity.backend.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AccountDTO accDTO){
        String token = authService.register(accDTO);
        return new AuthResponse(token, "Bearer");
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse  register(@RequestBody AccountDTO accDTO) {
        String token = authService.login(accDTO);
        return new AuthResponse(token, "Bearer");
    }
}
