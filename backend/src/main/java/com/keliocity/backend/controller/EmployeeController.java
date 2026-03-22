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
import com.keliocity.backend.service.ChangeService;
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
	private final ChangeService changeService;

	
	public EmployeeController(EmployeeRepository employeeRepo,
            DeskRepository deskRepo, MeetingEmployeeRepository meetingEmployeeRepo, ChangeService changeService) {
		this.employeeRepo = employeeRepo;
		this.deskRepo = deskRepo;
		this.meetingEmployeeRepo = meetingEmployeeRepo;
		this.changeService = changeService;
	}

    // API to get all employees
    @GetMapping
    public List<Employee> getAll() {
        return employeeRepo.findAll();
    }
    
    // API to get one employee based on its id
    @GetMapping("/{id}")
    public Employee getById(@PathVariable Integer id) {
        return employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Employee not found"));
    }

    // API to get all employees on a floor (based on its id)
    @GetMapping("/floor/{floorId}")
    public List<Employee> getByFloorId(@PathVariable Integer floorId) {
        return employeeRepo.findByDesk_Room_Floor_id(floorId);
    }

    // API to search an employee by its name for search bar
    @GetMapping("/search/{name}")
    public List<Employee> getByName(@PathVariable String name) {
        return employeeRepo.searchByName(name);
    }

    // API to get all employees currently in a meeting
    @GetMapping("/{id}/in-meeting")
    public boolean getInMeeting(@PathVariable Integer id) {
        return meetingEmployeeRepo.existsEmployeeInMeetingNow(id, LocalDateTime.now(ZoneId.of("Europe/Paris")));
    }

    // API to get all employees for one general status
    @GetMapping("/status/{status}")
    public List<Employee> getByStatus(@PathVariable EmployeeStatus status) {
        return employeeRepo.findByStatus(status);
    }

    // API to get all employees for one location (OFFICE or REMOTE)
    @GetMapping("/location/{loc}")
    public List<Employee> getByLocation(@PathVariable WorkLocation loc) {
        return employeeRepo.findByInOffice(loc);
    }

    // API to get all employees without desk
    @GetMapping("/no-desk")
    public List<Employee> getEmployeesWithoutDesk() {
        return employeeRepo.findByDeskIsNull();
    }

    // API to get the status of an employee considering the general status and if in a meeting or not
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

    // API to add a new employee
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

    // API to modify an employee (based on its id)
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

        if (updated.getDesk() != null) {
        	if (updated.getDesk().getId() != null) {
        		Desk desk = deskRepo.findById(updated.getDesk().getId())
        				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desk not found"));
        	    existing.setDesk(desk);
        	} else {
        		existing.setDesk(null);
        	}
        }
        changeService.inc();
        return employeeRepo.save(existing);
    }

    // API to delete an employee (based on its id)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        if (!employeeRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found");
        }
        changeService.inc();
        employeeRepo.deleteById(id);
    }

    // API to affect a desk (based on its id) to an existing employee (based on its id)
    @PatchMapping("/{id}/desk/{deskId}")
    public Employee assignDesk(@PathVariable Integer id, @PathVariable Integer deskId) {
        Employee emp = employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        Desk desk = deskRepo.findById(deskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Desk not found"));

        emp.setDesk(desk);
        return employeeRepo.save(emp);
    }

    // API to remove a desk (based on its id) to an existing employee (based on its id)
    @PatchMapping("/{id}/desk")
    public Employee clearDesk(@PathVariable Integer id) {
        Employee emp = employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        emp.setDesk(null);
        return employeeRepo.save(emp);
    }

    // API to change the general status of an employee (based on its id)
    @PatchMapping("/{id}/status/{status}")
    public Employee changeStatus(@PathVariable Integer id, @PathVariable EmployeeStatus status) {
        Employee emp = employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        emp.setStatus(status);
        return employeeRepo.save(emp);
    }

    // API to change the location (OFFICE or REMOTE) of an employee (based on its id)
    @PatchMapping("/{id}/location/{loc}")
    public Employee changeLocation(@PathVariable Integer id, @PathVariable WorkLocation loc) {
        Employee emp = employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        emp.setInOffice(loc);
        return employeeRepo.save(emp);
    }
	
}
