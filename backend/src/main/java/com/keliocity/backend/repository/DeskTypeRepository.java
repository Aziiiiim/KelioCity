package com.keliocity.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.DeskType;

@Repository
public interface DeskTypeRepository extends JpaRepository<DeskType, Integer> {
}
