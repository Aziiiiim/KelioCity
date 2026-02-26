package com.keliocity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.keliocity.backend.model.Desk;
import com.keliocity.backend.model.Room;

@Repository
public interface DeskRepository extends JpaRepository<Desk, Integer> {
	List<Desk> findByRoom(Room room);

    List<Desk> findByRoom_Id(Integer roomId);

    @Query("""
    SELECT d
    FROM Desk d
    LEFT JOIN d.room r
    WHERE LOWER(d.deskName) LIKE LOWER(CONCAT('%', :name, '%'))
    """)
    List<Desk> searchByName(@Param("name") String name);
    List<Desk> findByRoom_Floor_Id(Integer floorId);

    @Modifying
    @Transactional
    @Query(value = "ALTER TABLE desks AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();
}
