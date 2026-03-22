package com.keliocity.backend.model.dto;

// DTO for admin page API (DatabaseFillerDTO)
public class DeskDTO {

    private String deskName;
    private String roomName;
    private Integer deskNumber;

    public String getDeskName() {
        return deskName;
    }

    public String getRoomName() {
        return roomName;
    }

    public Integer getDeskNumber() {
        return deskNumber;
    }
}
