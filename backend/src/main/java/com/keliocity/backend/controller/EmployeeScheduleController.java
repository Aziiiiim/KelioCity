package com.keliocity.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.keliocity.backend.model.dto.EmployeeScheduleItemDTO;
import com.keliocity.backend.repository.MeetingEmployeeRepository;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeScheduleController {

    private final MeetingEmployeeRepository meetingEmployeeRepository;

    public EmployeeScheduleController(MeetingEmployeeRepository repo) {
        this.meetingEmployeeRepository = repo;
    }

    // API to get the schedule of an employee based on its id
    @GetMapping("/{id}/schedule")
    public List<EmployeeScheduleItemDTO> getSchedule(
        @PathVariable Integer id,
        @RequestParam LocalDate date
    ) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        return meetingEmployeeRepository
            .findScheduleForEmployeeAndDay(id, startOfDay, endOfDay)
            .stream()
            .map(me -> new EmployeeScheduleItemDTO(
                me.getMeeting().getStartingHour().toLocalTime(),
                me.getMeeting().getEndHour().toLocalTime(),
                me.getMeeting().getTitle(),
                me.getRemote()
            ))
            .toList();
    }
}

