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
    LEFT JOIN r.floor f
    LEFT JOIN r.roomType rt
    WHERE
      f.id = :floorId
      AND
      LOWER(r.roomName) LIKE LOWER(CONCAT('%', :name, '%'))
      AND
      rt.roomtypeName != 'Stairs'
    """)
    List<Room> searchByName(@Param("floorId") Integer floorId, @Param("name") String name);

    List<Room> findByFloor_id(Integer floorId);
}
