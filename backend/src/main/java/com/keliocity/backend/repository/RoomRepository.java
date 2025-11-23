package com.keliocity.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
}
