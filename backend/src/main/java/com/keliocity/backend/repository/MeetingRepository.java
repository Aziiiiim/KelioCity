package com.keliocity.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.Meeting;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Integer>{

}
