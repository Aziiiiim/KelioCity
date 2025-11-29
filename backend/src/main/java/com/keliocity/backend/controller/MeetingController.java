package com.keliocity.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.keliocity.backend.model.Meeting;
import com.keliocity.backend.model.Room;
import com.keliocity.backend.model.Desk;
import com.keliocity.backend.repository.MeetingRepository;
import com.keliocity.backend.repository.RoomRepository;
import com.keliocity.backend.repository.DeskRepository;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "*")
public class MeetingController {

    private final MeetingRepository meetingRepo;
    private final RoomRepository roomRepo;
    private final DeskRepository deskRepo;

    public MeetingController(MeetingRepository meetingRepo,
                             RoomRepository roomRepo,
                             DeskRepository deskRepo) {
        this.meetingRepo = meetingRepo;
        this.roomRepo = roomRepo;
        this.deskRepo = deskRepo;
    }

    @GetMapping
    public List<Meeting> getAll() {
        return meetingRepo.findAll();
    }

    @GetMapping("/{id}")
    public Meeting getById(@PathVariable Integer id) {
        return meetingRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));
    }

    // GET /api/meetings/room/{roomId}
    @GetMapping("/room/{roomId}")
    public List<Meeting> getByRoom(@PathVariable Integer roomId) {
        return meetingRepo.findByRoom_Id(roomId);
    }

    // GET /api/meetings/room/{roomId}/between?start=...&end=...
    @GetMapping("/room/{roomId}/between")
    public List<Meeting> getByRoomAndTime(
            @PathVariable Integer roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        return meetingRepo.findByRoom_IdAndStartingHourBetween(roomId, start, end);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Meeting create(@RequestBody Meeting meeting) {
        // Room obligatoire
        if (meeting.getRoom() == null || meeting.getRoom().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room is required");
        }
        Room room = roomRepo.findById(meeting.getRoom().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not found"));
        meeting.setRoom(room);

        // Desk optionnel
        if (meeting.getDesk() != null && meeting.getDesk().getId() != null) {
            Desk desk = deskRepo.findById(meeting.getDesk().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desk not found"));
            meeting.setDesk(desk);
        } else {
            meeting.setDesk(null);
        }

        meeting.setId(null);
        return meetingRepo.save(meeting);
    }

    @PutMapping("/{id}")
    public Meeting update(@PathVariable Integer id, @RequestBody Meeting updated) {
        Meeting existing = meetingRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));

        existing.setTitle(updated.getTitle());
        existing.setStartingHour(updated.getStartingHour());
        existing.setEndHour(updated.getEndHour());
        existing.setDescription(updated.getDescription());

        if (updated.getRoom() != null && updated.getRoom().getId() != null) {
            Room room = roomRepo.findById(updated.getRoom().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not found"));
            existing.setRoom(room);
        }

        if (updated.getDesk() != null && updated.getDesk().getId() != null) {
            Desk desk = deskRepo.findById(updated.getDesk().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desk not found"));
            existing.setDesk(desk);
        } else {
            existing.setDesk(null);
        }

        return meetingRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        if (!meetingRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found");
        }
        meetingRepo.deleteById(id);
    }
}
