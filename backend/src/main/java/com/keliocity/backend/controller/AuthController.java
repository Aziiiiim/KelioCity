package com.keliocity.backend.controller;

import com.keliocity.backend.model.dto.AuthResponse;
import com.keliocity.backend.model.dto.DeskAssignDTO;
import com.keliocity.backend.model.dto.LoginDTO;
import com.keliocity.backend.model.dto.MeDTO;
import com.keliocity.backend.model.dto.RegisterDTO;
import com.keliocity.backend.service.AuthService;
import com.keliocity.backend.service.ChangeService;

import java.security.Principal;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final ChangeService changeService;

    public AuthController(AuthService authService, ChangeService changeService){
        this.authService = authService;
        this.changeService = changeService;
    }

    // API to log in
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginDTO accDTO){
    	return authService.login(accDTO);
    }

    // API to register an account
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse  register(@RequestBody RegisterDTO accDTO) {
    	return authService.register(accDTO);
    }

    // API to get information about the current account (email, role)
    @GetMapping("/me")
    public MeDTO me(@AuthenticationPrincipal Jwt jwt) {
    	return new MeDTO(jwt.getSubject(), jwt.getClaimAsString("role"));
    }

    // API to assign a desk to the current user
    @PutMapping("/me/desk")
    public void assignMyDesk(@RequestBody DeskAssignDTO dto, Principal principal) {
    	String email = principal.getName();
    	changeService.inc();
    	authService.assignDesk(email, dto.deskId());
    }
}
