package com.keliocity.backend.model.dto;

// DTO for admin page API (DatabaseFillerDTO)
public class AccountDTO {

    private String email;
    private String lastName;
    private String firstName;
    private String role;
    private String password;

    public String getEmail() {
        return email;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getRole() {
        return role;
    }

    public String getPassword() {
        return password;
    }
}
