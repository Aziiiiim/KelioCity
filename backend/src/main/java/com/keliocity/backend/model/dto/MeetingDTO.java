package com.keliocity.backend.model.dto;

import java.time.LocalDateTime;

public class MeetingDTO {

    private String roomName;
    private Integer deskNumber; // optional
    private String title;
    private LocalDateTime startingHour;
    private LocalDateTime endHour;
    private String description; // optional

    public String getRoomName() {
        return roomName;
    }

    public Integer getDeskNumber() {
        return deskNumber;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getStartingHour() {
        return startingHour;
    }

    public LocalDateTime getEndHour() {
        return endHour;
    }

    public String getDescription() {
        return description;
    }
}
