package com.keliocity.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.Floor;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Integer> {
}
