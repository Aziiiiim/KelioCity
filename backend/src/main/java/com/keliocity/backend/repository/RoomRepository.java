package com.keliocity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.keliocity.backend.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query("""
    SELECT r
    FROM Room r
    LEFT JOIN r.roomType rt
    WHERE
      LOWER(r.roomName) LIKE LOWER(CONCAT('%', :name, '%'))
      AND
      rt.roomtypeName != 'Stairs'
    """)
    List<Room> searchByName(@Param("name") String name);

    List<Room> findByFloor_id(Integer floorId);

    @Modifying
    @Transactional
    @Query(value = "ALTER TABLE rooms AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();
}
