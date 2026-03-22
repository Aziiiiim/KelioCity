package com.keliocity.backend.model.dto;

// DTO for admin page API (DatabaseFillerDTO)
public class RoomDTO {

    private String roomType;
    private String roomName;
    private float coordX1;
    private float coordZ1;
    private float orientationDeg;
    private Integer openspaceNumber; // optional
    private String floorName;
    private String nextFloor;
    private String position;

    public String getRoomType() {
        return roomType;
    }

    public String getRoomName() {
        return roomName;
    }

    public float getCoordX1() {
        return coordX1;
    }

    public float getCoordZ1() {
        return coordZ1;
    }

    public float getOrientationDeg() {
        return orientationDeg;
    }

    public Integer getOpenspaceNumber() {
        return openspaceNumber;
    }

    public String getFloorName() {
        return floorName;
    }

    public String getNextFloor() {
        return nextFloor;
    }

    public String getPosition() {
        return position;
    }
}
