package com.keliocity.backend.model.dto;

import java.time.LocalTime;

public record EmployeeScheduleItemDTO(
    LocalTime startTime,
    LocalTime endTime,
    String title,
    boolean remote
) {}
