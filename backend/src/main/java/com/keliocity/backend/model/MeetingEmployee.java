package com.keliocity.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "MEETING_EMPLOYEES")
@Data
@NoArgsConstructor
public class MeetingEmployee {
	@EmbeddedId
    private MeetingEmployeeId id;

    @ManyToOne
    @MapsId("meetingId")
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;

    @ManyToOne
    @MapsId("employeeId")
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "present", nullable = false)
    private Boolean present;

    @Column(name = "remote", nullable = false)
    private Boolean remote;
    
    public MeetingEmployee(Meeting meeting, Employee employee,
	            Boolean present, Boolean remote) {
		this.meeting = meeting;
		this.employee = employee;
		this.present = present;
		this.remote = remote;
		this.id = new MeetingEmployeeId(meeting.getId(), employee.getId());
	}

}
