package com.keliocity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query("""
    SELECT r
    FROM Room r
    WHERE
      LOWER(r.roomName) LIKE LOWER(CONCAT('%', :name, '%'))
    """)
    List<Room> searchByName(@Param("name") String name);

    List<Room> findByFloor_floorName(String floorName);
}
