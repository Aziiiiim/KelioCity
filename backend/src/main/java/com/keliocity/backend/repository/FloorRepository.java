package com.keliocity.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.keliocity.backend.model.Floor;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Integer> {

    @Modifying
    @Transactional
    @Query(value = "ALTER TABLE floors AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();
}
