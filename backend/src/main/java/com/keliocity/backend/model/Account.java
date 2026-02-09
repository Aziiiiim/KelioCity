package com.keliocity.backend.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ACCOUNT")
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email", nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private AccountRole role;

    @Column(name = "password", nullable = false)
    private String password;

    //@OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    //private Employee employee;
    
    public Account(){
        this.role = AccountRole.USER;
    }

    public Account(String email, String password, Employee employee){
        this.email = email;
        this.password = password;
        this.role = AccountRole.USER;
        //this.employee = employee;
    }
}
