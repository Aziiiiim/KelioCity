package com.keliocity.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.keliocity.backend.model.Desk;
import com.keliocity.backend.model.Room;
import com.keliocity.backend.repository.DeskRepository;
import com.keliocity.backend.repository.RoomRepository;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/desks")
@CrossOrigin(origins = "*")
public class DeskController {

    private final DeskRepository deskRepo;
    private final RoomRepository roomRepo;

    public DeskController(DeskRepository deskRepo, RoomRepository roomRepo) {
        this.deskRepo = deskRepo;
        this.roomRepo = roomRepo;
    }

    // API to get all desks
    @GetMapping
    public List<Desk> getAll() {
        return deskRepo.findAll();
    }

    // APÏ to get info for one desk based on its id
    @GetMapping("/{id}")
    public Desk getById(@PathVariable Integer id) {
        return deskRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Desk not found"));
    }

    // API to get all desks from one room (based on its id)
    @GetMapping("/room/{roomId}")
    public List<Desk> getByRoom(@PathVariable Integer roomId) {
        return deskRepo.findByRoom_Id(roomId);
    }

    // API to get all desks on a floor (based on its id)
    @GetMapping("/floor/{floorId}")
    public List<Desk> getByFloor(@PathVariable Integer floorId) {
        return deskRepo.findByRoom_Floor_Id(floorId);
    }

    // API to get all desks that include a string in their name (for search bar)
    @GetMapping("/search/{name}")
    public List<Desk> getByName(@PathVariable String name) {
        return deskRepo.searchByName(name);
    }

    // API to create a new desk
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Desk create(@RequestBody Desk desk) {
        if (desk.getRoom() == null || desk.getRoom().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room is required");
        }
        Room room = roomRepo.findById(desk.getRoom().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not found"));
        desk.setRoom(room);
        desk.setId(null);
        return deskRepo.save(desk);
    }

    // API to modify a desk based on its id
    @PutMapping("/{id}")
    public Desk update(@PathVariable Integer id, @RequestBody Desk updated) {
        Desk existing = deskRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Desk not found"));

        existing.setDeskName(updated.getDeskName());
        existing.setDeskType(updated.getDeskType());

        if (updated.getRoom() != null && updated.getRoom().getId() != null) {
            Room room = roomRepo.findById(updated.getRoom().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not found"));
            existing.setRoom(room);
        }

        return deskRepo.save(existing);
    }

    // API to delete a desk based on its id
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        if (!deskRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Desk not found");
        }
        deskRepo.deleteById(id);
    }
}
