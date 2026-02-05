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

    @GetMapping
    public List<DeskType> getAll() {
        return deskTypeRepo.findAll();
    }

    @GetMapping("/{id}")
    public DeskType getById(@PathVariable Integer id) {
        return deskTypeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "DeskType not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeskType create(@RequestBody DeskType deskType) {
        deskType.setId(null);
        return deskTypeRepo.save(deskType);
    }

    @PutMapping("/{id}")
    public DeskType update(@PathVariable Integer id, @RequestBody DeskType updated) {
        DeskType existing = deskTypeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "DeskType not found"));

        existing.setCoordX(updated.getCoordX());
        existing.setCoordZ(updated.getCoordZ());
        existing.setOrientationDeg(updated.getOrientationDeg());

        return deskTypeRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        if (!deskTypeRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DeskType not found");
        }
        deskTypeRepo.deleteById(id);
    }
}
