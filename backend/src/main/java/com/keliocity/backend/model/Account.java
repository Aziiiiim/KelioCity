package com.keliocity.backend.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "USERS")
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "role", nullable = false)
    private AccountRole role;

    @Column(name = "password", nullable = false)
    private String password;

    public Account(){
        this.role = AccountRole.USER;
    }

    public Account(String email, String password){
        this.email = email;
        this.password = password;
        this.role = AccountRole.USER;
    }
}
