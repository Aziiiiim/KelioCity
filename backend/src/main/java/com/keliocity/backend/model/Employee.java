package com.keliocity.backend.model;
	
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "EMPLOYEES")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @ManyToOne
    @JoinColumn(name = "desk_id")
    private Desk desk; // peut être null si pas de bureau attribué

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "working_hours")
    private String workingHours;

    @Enumerated(EnumType.STRING)
    @Column(name = "in_office", nullable = false)
    private WorkLocation inOffice; // OFFICE / REMOTE

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EmployeeStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "sprite", nullable = false)
    private Sprite sprite;
    
    @OneToOne(mappedBy = "employee")
    @JsonIgnore
    private Account account;
}
