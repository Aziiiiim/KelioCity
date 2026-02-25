package com.keliocity.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.keliocity.backend.model.Meeting;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Integer>{
	List<Meeting> findByRoom_Id(Integer roomId);

    List<Meeting> findByRoom_IdAndStartingHourBetween(Integer roomId,
                                                       LocalDateTime start,
                                                       LocalDateTime end);

    @Modifying
    @Transactional
    @Query(value = "ALTER TABLE meetings AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();
}
