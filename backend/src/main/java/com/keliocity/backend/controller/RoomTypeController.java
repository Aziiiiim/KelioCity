package com.keliocity.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.keliocity.backend.model.RoomType;
import com.keliocity.backend.repository.RoomTypeRepository;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/room-types")
@CrossOrigin(origins = "*")
public class RoomTypeController {

    private final RoomTypeRepository roomTypeRepo;

    public RoomTypeController(RoomTypeRepository roomTypeRepo) {
        this.roomTypeRepo = roomTypeRepo;
    }

    @GetMapping
    public List<RoomType> getAll() {
        return roomTypeRepo.findAll();
    }

    @GetMapping("/{id}")
    public RoomType getById(@PathVariable Integer id) {
        return roomTypeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "RoomType not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoomType create(@RequestBody RoomType roomType) {
        roomType.setId(null);
        return roomTypeRepo.save(roomType);
    }

    @PutMapping("/{id}")
    public RoomType update(@PathVariable Integer id, @RequestBody RoomType updated) {
        RoomType existing = roomTypeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "RoomType not found"));

        existing.setRoomtypeName(updated.getRoomtypeName());
        existing.setLengthX(updated.getLengthX());
        existing.setLengthZ(updated.getLengthZ());

        return roomTypeRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        if (!roomTypeRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "RoomType not found");
        }
        roomTypeRepo.deleteById(id);
    }
}
