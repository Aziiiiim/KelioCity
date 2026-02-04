package com.keliocity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
    LEFT JOIN r.floor f
    WHERE
      f.id = :floorId
      AND
      LOWER(d.deskName) LIKE LOWER(CONCAT('%', :name, '%'))
    """)
    List<Desk> searchByName(@Param("floorId") Integer floorId, @Param("name") String name);
}
