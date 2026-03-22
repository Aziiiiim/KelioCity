package com.keliocity.backend.model.dto;

// DTO for admin page API (DatabaseFillerDTO)
public class ResetDTO {

    private boolean floors;
    private boolean rooms;
    private boolean desks;
    private boolean employees;
    private boolean accounts;
    private boolean meetings;
    private boolean meetingEmployees;

    public boolean getFloors() {
        return floors;
    }

    public boolean getRooms() {
        return rooms;
    }

    public boolean getDesks() {
        return desks;
    }

    public boolean getEmployees() {
        return employees;
    }

    public boolean getAccounts() {
        return accounts;
    }

    public boolean getMeetings() {
        return meetings;
    }

    public boolean getMeetingEmployees() {
        return meetingEmployees;
    }
}
