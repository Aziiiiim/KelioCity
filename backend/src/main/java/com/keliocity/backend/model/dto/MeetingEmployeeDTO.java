package com.keliocity.backend.model.dto;

// DTO for admin page API (DatabaseFillerDTO)
public class MeetingEmployeeDTO {

    private String meetingTitle;
    private String employeeFirstName;
    private String employeeLastName;
    private boolean present;
    private boolean remote;

    public String getMeetingTitle() {
        return meetingTitle;
    }

    public String getEmployeeFirstName() {
        return employeeFirstName;
    }

    public String getEmployeeLastName() {
        return employeeLastName;
    }

    public boolean getPresent() {
        return present;
    }

    public boolean getRemote() {
        return remote;
    }
}
