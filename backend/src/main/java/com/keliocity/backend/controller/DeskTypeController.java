package com.keliocity.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.keliocity.backend.model.DeskType;
import com.keliocity.backend.repository.DeskTypeRepository;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/desk-types")
@CrossOrigin(origins = "*")
public class DeskTypeController {

    private final DeskTypeRepository deskTypeRepo;

    public DeskTypeController(DeskTypeRepository deskTypeRepo) {
        this.deskTypeRepo = deskTypeRepo;
    }

    // API to get all deskTypes
    @GetMapping
    public List<DeskType> getAll() {
        return deskTypeRepo.findAll();
    }

    // API to get one deskType based on its id
    @GetMapping("/{id}")
    public DeskType getById(@PathVariable Integer id) {
        return deskTypeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "DeskType not found"));
    }

    // API to add a new deskType
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeskType create(@RequestBody DeskType deskType) {
        deskType.setId(null);
        return deskTypeRepo.save(deskType);
    }

    // API to modify a deskType based on its id
    @PutMapping("/{id}")
    public DeskType update(@PathVariable Integer id, @RequestBody DeskType updated) {
        DeskType existing = deskTypeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "DeskType not found"));

        existing.setCoordX(updated.getCoordX());
        existing.setCoordZ(updated.getCoordZ());
        existing.setOrientationDeg(updated.getOrientationDeg());

        return deskTypeRepo.save(existing);
    }

    // API to delete a deskType based on its id
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        if (!deskTypeRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DeskType not found");
        }
        deskTypeRepo.deleteById(id);
    }
}
