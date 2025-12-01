package com.keliocity.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.keliocity.backend.model.MeetingEmployee;
import com.keliocity.backend.model.MeetingEmployeeId;
import com.keliocity.backend.model.Meeting;
import com.keliocity.backend.model.Employee;
import com.keliocity.backend.repository.MeetingEmployeeRepository;
import com.keliocity.backend.repository.MeetingRepository;
import com.keliocity.backend.repository.EmployeeRepository;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/meeting-participants")
@CrossOrigin(origins = "*")
public class MeetingEmployeeController {

    private final MeetingEmployeeRepository meetingEmployeeRepo;
    private final MeetingRepository meetingRepo;
    private final EmployeeRepository employeeRepo;

    public MeetingEmployeeController(MeetingEmployeeRepository meetingEmployeeRepo,
                                     MeetingRepository meetingRepo,
                                     EmployeeRepository employeeRepo) {
        this.meetingEmployeeRepo = meetingEmployeeRepo;
        this.meetingRepo = meetingRepo;
        this.employeeRepo = employeeRepo;
    }

    // GET /api/meeting-participants/meeting/{meetingId}
    @GetMapping("/meeting/{meetingId}")
    public List<MeetingEmployee> getParticipantsByMeeting(@PathVariable Integer meetingId) {
        return meetingEmployeeRepo.findByMeeting_Id(meetingId);
    }

    // GET /api/meeting-participants/employee/{employeeId}
    @GetMapping("/employee/{employeeId}")
    public List<MeetingEmployee> getMeetingsByEmployee(@PathVariable Integer employeeId) {
        return meetingEmployeeRepo.findByEmployee_Id(employeeId);
    }

    // POST /api/meeting-participants
    // body: { "meeting": { "id": ... }, "employee": { "id": ... }, "present": true, "remote": false }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MeetingEmployee addParticipant(@RequestBody MeetingEmployee body) {
        if (body.getMeeting() == null || body.getMeeting().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting is required");
        }
        if (body.getEmployee() == null || body.getEmployee().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee is required");
        }

        Meeting meeting = meetingRepo.findById(body.getMeeting().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting not found"));

        Employee employee = employeeRepo.findById(body.getEmployee().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee not found"));

        MeetingEmployee me = new MeetingEmployee(
                meeting,
                employee,
                body.getPresent() != null ? body.getPresent() : Boolean.FALSE,
                body.getRemote() != null ? body.getRemote() : Boolean.FALSE
        );

        return meetingEmployeeRepo.save(me);
    }

    // PATCH /api/meeting-participants/{meetingId}/{employeeId}
    @PatchMapping("/{meetingId}/{employeeId}")
    public MeetingEmployee updateFlags(@PathVariable Integer meetingId,
                                       @PathVariable Integer employeeId,
                                       @RequestBody MeetingEmployee body) {
        MeetingEmployeeId id = new MeetingEmployeeId(meetingId, employeeId);
        MeetingEmployee existing = meetingEmployeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "MeetingEmployee not found"));

        if (body.getPresent() != null) {
            existing.setPresent(body.getPresent());
        }
        if (body.getRemote() != null) {
            existing.setRemote(body.getRemote());
        }

        return meetingEmployeeRepo.save(existing);
    }

    // DELETE /api/meeting-participants/{meetingId}/{employeeId}
    @DeleteMapping("/{meetingId}/{employeeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeParticipant(@PathVariable Integer meetingId,
                                  @PathVariable Integer employeeId) {
        MeetingEmployeeId id = new MeetingEmployeeId(meetingId, employeeId);
        if (!meetingEmployeeRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "MeetingEmployee not found");
        }
        meetingEmployeeRepo.deleteById(id);
    }
}
