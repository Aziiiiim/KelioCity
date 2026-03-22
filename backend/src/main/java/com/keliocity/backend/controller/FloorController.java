package com.keliocity.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.keliocity.backend.model.Floor;
import com.keliocity.backend.repository.FloorRepository;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/floors")
@CrossOrigin(origins = "*")
public class FloorController {

    private final FloorRepository floorRepo;

    public FloorController(FloorRepository floorRepo) {
        this.floorRepo = floorRepo;
    }

    // API to get all floors
    @GetMapping
    public List<Floor> getAll() {
        return floorRepo.findAll();
    }

    // API to get one floor (based on its id)
    @GetMapping("/{id}")
    public Floor getById(@PathVariable Integer id) {
        return floorRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Floor not found"));
    }

    // API to create a new floor
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Floor create(@RequestBody Floor floor) {
        floor.setId(null);
        return floorRepo.save(floor);
    }

    // API to modify a floor (based on its id)
    @PutMapping("/{id}")
    public Floor update(@PathVariable Integer id, @RequestBody Floor updated) {
        Floor existing = floorRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Floor not found"));

        existing.setFloorName(updated.getFloorName());
        existing.setLengthX(updated.getLengthX());
        existing.setLengthZ(updated.getLengthZ());

        return floorRepo.save(existing);
    }

    // API to delete a floor (based on its id)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        if (!floorRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Floor not found");
        }
        floorRepo.deleteById(id);
    }
}
