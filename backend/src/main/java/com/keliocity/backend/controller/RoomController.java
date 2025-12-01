package com.keliocity.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.keliocity.backend.model.Room;
import com.keliocity.backend.model.RoomType;
import com.keliocity.backend.repository.RoomRepository;
import com.keliocity.backend.repository.RoomTypeRepository;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomRepository roomRepo;
    private final RoomTypeRepository roomTypeRepo;

    public RoomController(RoomRepository roomRepo, RoomTypeRepository roomTypeRepo) {
        this.roomRepo = roomRepo;
        this.roomTypeRepo = roomTypeRepo;
    }

    @GetMapping
    public List<Room> getAll() {
        return roomRepo.findAll();
    }

    @GetMapping("/{id}")
    public Room getById(@PathVariable Integer id) {
        return roomRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Room create(@RequestBody Room room) {
        if (room.getRoomType() == null || room.getRoomType().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "RoomType is required");
        }
        RoomType type = roomTypeRepo.findById(room.getRoomType().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "RoomType not found"));

        room.setRoomType(type);
        room.setId(null);
        return roomRepo.save(room);
    }

    @PutMapping("/{id}")
    public Room update(@PathVariable Integer id, @RequestBody Room updated) {
        Room existing = roomRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        existing.setRoomName(updated.getRoomName());
        existing.setCoordX1(updated.getCoordX1());
        existing.setCoordZ1(updated.getCoordZ1());
        existing.setOrientationDeg(updated.getOrientationDeg());
        existing.setOpenspaceNumber(updated.getOpenspaceNumber());

        if (updated.getRoomType() != null && updated.getRoomType().getId() != null) {
            RoomType type = roomTypeRepo.findById(updated.getRoomType().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "RoomType not found"));
            existing.setRoomType(type);
        }

        return roomRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        if (!roomRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }
        roomRepo.deleteById(id);
    }
}
