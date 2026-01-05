package com.keliocity.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.MeetingEmployee;
import com.keliocity.backend.model.MeetingEmployeeId;

@Repository
public interface MeetingEmployeeRepository extends JpaRepository<MeetingEmployee, MeetingEmployeeId> {
	List<MeetingEmployee> findByMeeting_Id(Integer meetingId);

    List<MeetingEmployee> findByEmployee_Id(Integer employeeId);

    @Query("""
    SELECT me FROM MeetingEmployee me
    WHERE me.employee.id = :employeeId
    AND me.meeting.startingHour >= :startOfDay
    AND me.meeting.startingHour < :endOfDay
    ORDER BY me.meeting.startingHour
    """)
    List<MeetingEmployee> findScheduleForEmployeeAndDay(
        @Param("employeeId") Integer employeeId,
        @Param("startOfDay") LocalDateTime startOfDay,
        @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query("""
    SELECT COUNT(me) > 0
    FROM MeetingEmployee me
    WHERE me.employee.id = :employeeId
      AND me.present = true
      AND me.meeting.startingHour <= :now
      AND me.meeting.endHour >= :now
    """)
    boolean existsEmployeeInMeetingNow(
        @Param("employeeId") Integer employeeId,
        @Param("now") LocalDateTime now
    );
}
