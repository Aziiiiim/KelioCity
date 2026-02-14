package com.keliocity.backend.model.dto;

import java.util.List;

public class DatabaseFillerDTO {

    private boolean reset;
    private List<FloorDTO> floors;
    private List<RoomDTO> rooms;
    private List<DeskDTO> desks;
    private List<EmployeeDTO> employees;
    private List<MeetingDTO> meetings;
    private List<MeetingEmployeeDTO> meetingEmployees;

    public boolean getReset() {
        return reset;
    }

    public List<FloorDTO> getFloors() {
        return floors;
    }

    public List<RoomDTO> getRooms() {
        return rooms;
    }

    public List<DeskDTO> getDesks() {
        return desks;
    }

    public List<EmployeeDTO> getEmployees() {
        return employees;
    }

    public List<MeetingDTO> getMeetings() {
        return meetings;
    }

    public List<MeetingEmployeeDTO> getMeetingEmployees() {
        return meetingEmployees;
    }
}