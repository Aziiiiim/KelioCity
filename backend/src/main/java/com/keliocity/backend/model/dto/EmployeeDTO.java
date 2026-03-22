package com.keliocity.backend.model.dto;

// DTO for admin page API (DatabaseFillerDTO)
public class EmployeeDTO {

    private String lastName;
    private String firstName;
    private String roomName; // optional
    private String deskName; // optional
    private Integer deskNumber; // optional
    private String phoneNumber; // optional
    private String email; // optional
    private String workingHours; // optional
    private String inOffice;
    private String status;
    private String sprite;

    public String getLastName() {
        return lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getRoomName() {
        return roomName;
    }

    public String getDeskName() {
        return deskName;
    }

    public Integer getDeskNumber() {
        return deskNumber;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getWorkingHours() {
        return workingHours;
    }

    public String getInOffice() {
        return inOffice;
    }

    public String getStatus() {
        return status;
    }

    public String getSprite() {
        return sprite;
    }
}
