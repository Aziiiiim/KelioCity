package com.keliocity.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.MeetingEmployee;
import com.keliocity.backend.model.MeetingEmployeeId;

@Repository
public interface MeetingEmployeeRepository extends JpaRepository<MeetingEmployee, MeetingEmployeeId> {

}
