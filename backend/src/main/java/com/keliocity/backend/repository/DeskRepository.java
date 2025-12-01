package com.keliocity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.Desk;
import com.keliocity.backend.model.Room;

@Repository
public interface DeskRepository extends JpaRepository<Desk, Integer> {
	List<Desk> findByRoom(Room room);

    List<Desk> findByRoom_Id(Integer roomId);

}
