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
import com.keliocity.backend.model.Desk;
import com.keliocity.backend.model.Employee;
import com.keliocity.backend.model.EmployeeStatus;
import com.keliocity.backend.model.WorkLocation;
import com.keliocity.backend.model.dto.LoginDTO;
import com.keliocity.backend.model.dto.RegisterDTO;
import com.keliocity.backend.repository.AccountRepository;
import com.keliocity.backend.repository.DeskRepository;
import com.keliocity.backend.repository.EmployeeRepository;

@Service
public class AuthService {
    
    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DeskRepository deskRepo;
    private final EmployeeRepository employeeRepo;

    public AuthService(AccountRepository accountRepo, PasswordEncoder passwordEncoder, JwtService jwtService, DeskRepository deskRepo, EmployeeRepository employeeRepo){
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.deskRepo = deskRepo;
        this.employeeRepo = employeeRepo;
    }

    @Transactional
    public String register(RegisterDTO accDTO){
        if (accountRepo.existsByEmail(accDTO.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email déjà utilisé");
        }

        if(!isValidEmail(accDTO.email())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email invalide");
        }
        if(!isValidPassword(accDTO.password())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mot de passe invalide");
        }
        
        Employee emp = Employee.builder()
                .firstName(accDTO.firstName())
                .lastName(accDTO.lastName())
                .email(accDTO.email())
                .sprite(accDTO.sprite())
                .phoneNumber(accDTO.phoneNumber())
                .status(EmployeeStatus.AVAILABLE)
                .inOffice(WorkLocation.OFFICE)
                .build();

        
        Account acc = new Account();
        acc.setEmail(accDTO.email());
        acc.setPassword(passwordEncoder.encode(accDTO.password()));
        acc.setRole(AccountRole.USER);
        acc.setEmployee(emp);
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

    public String login(LoginDTO accDTO){
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
    
    @Transactional
    public void assignDesk(String email, Integer deskId) {
        Account acc = accountRepo.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Employee emp = acc.getEmployee();
        if (emp == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No employee linked");

        Desk desk = deskRepo.findById(deskId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Desk not found"));

        // vérifier libre
        boolean occupied = employeeRepo.existsByDeskId(deskId);
        if (occupied) throw new ResponseStatusException(HttpStatus.CONFLICT, "Desk already occupied");

        emp.setDesk(desk);
        employeeRepo.save(emp);
    }
}
