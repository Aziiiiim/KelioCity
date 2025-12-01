package com.keliocity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.MeetingEmployee;
import com.keliocity.backend.model.MeetingEmployeeId;

@Repository
public interface MeetingEmployeeRepository extends JpaRepository<MeetingEmployee, MeetingEmployeeId> {
	List<MeetingEmployee> findByMeeting_Id(Integer meetingId);

    List<MeetingEmployee> findByEmployee_Id(Integer employeeId);
}
