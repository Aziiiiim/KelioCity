package com.keliocity.backend.model.dto;

public class MeetingEmployeeDTO {

    private String employeeFullName;
    private boolean present;
    private boolean remote;

    public String getEmployeeFullName() {
        return employeeFullName;
    }

    public boolean getPresent() {
        return present;
    }

    public boolean getRemote() {
        return remote;
    }
}
