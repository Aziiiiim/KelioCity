package com.keliocity.backend.controller;

import java.time.ZoneId;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.keliocity.backend.model.Employee;
import com.keliocity.backend.model.EmployeeStatus;
import com.keliocity.backend.model.WorkLocation;
import com.keliocity.backend.model.Desk;
import com.keliocity.backend.repository.EmployeeRepository;
import com.keliocity.backend.repository.MeetingEmployeeRepository;
import com.keliocity.backend.repository.DeskRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

	private EmployeeRepository employeeRepo;
	private final MeetingEmployeeRepository meetingEmployeeRepo;
	private final DeskRepository deskRepo;

	
	public EmployeeController(EmployeeRepository employeeRepo,
            DeskRepository deskRepo, MeetingEmployeeRepository meetingEmployeeRepo) {
		this.employeeRepo = employeeRepo;
		this.deskRepo = deskRepo;
		this.meetingEmployeeRepo = meetingEmployeeRepo;
	}


    @GetMapping
    public List<Employee> getAll() {
        return employeeRepo.findAll();
    }
    
    // GET /api/employees/{id}
    @GetMapping("/{id}")
    public Employee getById(@PathVariable Integer id) {
        return employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Employee not found"));
    }

    // GET /api/employees/{id}/in-meeting
    @GetMapping("/{id}/in-meeting")
    public boolean getInMeeting(@PathVariable Integer id) {
        return meetingEmployeeRepo.existsEmployeeInMeetingNow(id, LocalDateTime.now(ZoneId.of("Europe/Paris")));
    }

    // GET /api/employees/{id}/global_status
    @GetMapping("/{id}/global_status")
    public String getGlobalStatus(@PathVariable Integer id) {
        Employee employee = getById(id);
        boolean in_meeting = getInMeeting(id);
        EmployeeStatus status = employee.getStatus();
        if ( status == EmployeeStatus.AVAILABLE && employee.getInOffice() == WorkLocation.OFFICE && !in_meeting) {
            return "AVAILABLE";
        } else if (employee.getInOffice() == WorkLocation.REMOTE && status == EmployeeStatus.AVAILABLE && !in_meeting) {
            return "REMOTE";
        } else if (status == EmployeeStatus.OCCUPIED || (in_meeting && employee.getStatus() != EmployeeStatus.ABSENT)) {
            return "OCCUPIED";
        } else if (status == EmployeeStatus.ABSENT) {
            return "ABSENT";
        }
        return "";
    }

    // GET /api/employees/search/{name}
    @GetMapping("/search/{name}")
    public List<Employee> getByName(@PathVariable String name) {
        return employeeRepo.searchByName(name);
    }

    // GET /api/employees/floor/{floorId}
    @GetMapping("/floor/{floorId}")
    public List<Employee> getByFloorId(@PathVariable Integer floorId) {
        return employeeRepo.findByDesk_Room_Floor_id(floorId);
    }

    // POST /api/employees
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Employee create(@RequestBody Employee employee) {
        employee.setId(null); // on laisse l’auto-incrément gérer
        // si le desk est envoyé avec juste l’id -> on le recharge pour éviter une entité détachée
        if (employee.getDesk() != null && employee.getDesk().getId() != null) {
            Desk desk = deskRepo.findById(employee.getDesk().getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Desk not found"));
            employee.setDesk(desk);
        }
        return employeeRepo.save(employee);
    }

    // PUT /api/employees/{id}
    @PutMapping("/{id}")
    public Employee update(@PathVariable Integer id, @RequestBody Employee updated) {
        Employee existing = employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Employee not found"));

        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setPhoneNumber(updated.getPhoneNumber());
        existing.setEmail(updated.getEmail());
        existing.setWorkingHours(updated.getWorkingHours());
        existing.setInOffice(updated.getInOffice());
        existing.setStatus(updated.getStatus());
        existing.setSprite(updated.getSprite());

        if (updated.getDesk() != null && updated.getDesk().getId() != null) {
            Desk desk = deskRepo.findById(updated.getDesk().getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Desk not found"));
            existing.setDesk(desk);
        } else {
            existing.setDesk(null);
        }

        return employeeRepo.save(existing);
    }

    // DELETE /api/employees/{id}
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        if (!employeeRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found");
        }
        employeeRepo.deleteById(id);
    }

    // --- Filtres utiles ---

    // GET /api/employees/status/{status}
    @GetMapping("/status/{status}")
    public List<Employee> getByStatus(@PathVariable EmployeeStatus status) {
        return employeeRepo.findByStatus(status);
    }

    // GET /api/employees/location/{loc} (OFFICE / REMOTE)
    @GetMapping("/location/{loc}")
    public List<Employee> getByLocation(@PathVariable WorkLocation loc) {
        return employeeRepo.findByInOffice(loc);
    }

    // GET /api/employees/no-desk
    @GetMapping("/no-desk")
    public List<Employee> getEmployeesWithoutDesk() {
        return employeeRepo.findByDeskIsNull();
    }

    // PATCH /api/employees/{id}/desk/{deskId}  (affecter un desk)
    @PatchMapping("/{id}/desk/{deskId}")
    public Employee assignDesk(@PathVariable Integer id, @PathVariable Integer deskId) {
        Employee emp = employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        Desk desk = deskRepo.findById(deskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Desk not found"));

        emp.setDesk(desk);
        return employeeRepo.save(emp);
    }

    // PATCH /api/employees/{id}/desk (retirer le desk)
    @PatchMapping("/{id}/desk")
    public Employee clearDesk(@PathVariable Integer id) {
        Employee emp = employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        emp.setDesk(null);
        return employeeRepo.save(emp);
    }

    // PATCH /api/employees/{id}/status/{status}
    @PatchMapping("/{id}/status/{status}")
    public Employee changeStatus(@PathVariable Integer id, @PathVariable EmployeeStatus status) {
        Employee emp = employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        emp.setStatus(status);
        return employeeRepo.save(emp);
    }

    // PATCH /api/employees/{id}/location/{loc}
    @PatchMapping("/{id}/location/{loc}")
    public Employee changeLocation(@PathVariable Integer id, @PathVariable WorkLocation loc) {
        Employee emp = employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        emp.setInOffice(loc);
        return employeeRepo.save(emp);
    }
	
}
