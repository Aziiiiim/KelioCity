package com.keliocity.backend.model.dto;

// DTO for admin page API (DatabaseFillerDTO)
public class FloorDTO {

    private String floorName;
    private float lengthX;
    private float lengthZ;

    public String getFloorName() {
        return floorName;
    }

    public float getLengthX() {
        return lengthX;
    }

    public float getLengthZ() {
        return lengthZ;
    }
}
