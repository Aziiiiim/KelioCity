package com.keliocity.backend.controller;

import java.util.List;
import java.util.HashMap;
import java.util.LinkedHashMap;

import com.keliocity.backend.model.dto.*;
import com.keliocity.backend.model.*;
import com.keliocity.backend.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/database-filler")
@CrossOrigin(origins = "*")
public class DatabaseFillerController {
    private final DeskRepository deskRepo;
    private final DeskTypeRepository deskTypeRepo;
    private final EmployeeRepository employeeRepo;
    private final FloorRepository floorRepo;
    private final MeetingEmployeeRepository meetingEmployeeRepo;
    private final MeetingRepository meetingRepo;
    private final RoomRepository roomRepo;
    private final RoomTypeRepository roomTypeRepo;
    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;


    public DatabaseFillerController(DeskRepository deskRepo, EmployeeRepository employeeRepo, FloorRepository floorRepo, MeetingEmployeeRepository meetingEmployeeRepo, MeetingRepository meetingRepo, RoomRepository roomRepo, RoomTypeRepository roomTypeRepo, DeskTypeRepository deskTypeRepo, AccountRepository accountRepo, PasswordEncoder passwordEncoder) {
        this.deskRepo = deskRepo;
        this.deskTypeRepo = deskTypeRepo;
        this.employeeRepo = employeeRepo;
        this.floorRepo = floorRepo;
        this.meetingEmployeeRepo = meetingEmployeeRepo;
        this.meetingRepo = meetingRepo;
        this.roomRepo = roomRepo;
        this.roomTypeRepo = roomTypeRepo;
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // API to fill the db with a lot of information (from admin page)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String create(@RequestBody DatabaseFillerDTO dbFillerDTO) {
        // First security (there is also JWT, we should ensure the security in the current use of JWT before removing this security)
        if (dbFillerDTO.getAuth() != null && !(dbFillerDTO.getAuth().equals("AUTH_PR0C0M_k3l10c1ty"))) {
            return "not authentified";
        }

        // We check which tables to reset in the right order (and reset auto increment also)
        if (dbFillerDTO.getReset().getMeetingEmployees()) {
            meetingEmployeeRepo.deleteAll();
            meetingEmployeeRepo.resetAutoIncrement();
            meetingEmployeeRepo.flush();
        }
        if (dbFillerDTO.getReset().getMeetings()) {
            meetingRepo.deleteAll();
            meetingRepo.resetAutoIncrement();
            meetingRepo.flush();
        }
        if (dbFillerDTO.getReset().getAccounts()) {
            accountRepo.deleteAll();
            accountRepo.resetAutoIncrement();
            accountRepo.flush();
        }
        if (dbFillerDTO.getReset().getEmployees()) {
            employeeRepo.deleteAll();
            employeeRepo.resetAutoIncrement();
            employeeRepo.flush();
        }
        if (dbFillerDTO.getReset().getDesks()) {
            deskRepo.deleteAll();
            deskRepo.resetAutoIncrement();
            deskRepo.flush();
        }
        if (dbFillerDTO.getReset().getRooms()) {
            roomRepo.deleteAll();
            roomRepo.resetAutoIncrement();
            roomRepo.flush();
        }
        if (dbFillerDTO.getReset().getFloors()) {
            floorRepo.deleteAll();
            floorRepo.resetAutoIncrement();
            floorRepo.flush();
        }

        // We get all roomTypes and deskTypes and put them in a map to access them easily
        HashMap<String, RoomType> roomTypes = new HashMap<String, RoomType>();
        List<RoomType> roomTypeList = roomTypeRepo.findAll();
        for (int i=0; i<roomTypeList.size(); i++) {
            roomTypes.put(roomTypeList.get(i).getRoomtypeName().trim().toUpperCase(), roomTypeList.get(i));
        }
        HashMap<String, DeskType> deskTypes = new HashMap<String, DeskType>();
        List<DeskType> deskTypeList = deskTypeRepo.findAll();
        for (int i=0; i<deskTypeList.size(); i++) {
            deskTypes.put((deskTypeList.get(i).getRoomType().getRoomtypeName()+"_"+deskTypeList.get(i).getDeskNumber()).trim().toUpperCase(), deskTypeList.get(i));
        }

        // We get all floors in the db in a map to access them easily
        LinkedHashMap<String, Floor> floors = new LinkedHashMap<String, Floor>();
        List<Floor> floorList = floorRepo.findAll();
        for (int i=0; i<floorList.size(); i++) {
            floors.put(floorList.get(i).getFloorName().trim().toUpperCase(), floorList.get(i));
        }
        // We create each new floors from the API
        for (int i=0; i<dbFillerDTO.getFloors().size(); i++) {
            // we have a default floor name if not filled
            String floorname = dbFillerDTO.getFloors().get(i).getFloorName();
            if (floorname == null) {
                floorname = "floor_"+floors.size();
            }
            floors.put(floorname.trim().toUpperCase(), floorRepo.save(
                Floor.builder()
                    .floorName(floorname)
                    .lengthX(dbFillerDTO.getFloors().get(i).getLengthX())
                    .lengthZ(dbFillerDTO.getFloors().get(i).getLengthZ())
                    .build()
            ));
        }
        floorRepo.flush();

        // We get all rooms in the db in a map to access them easily
        HashMap<String, Room> rooms = new HashMap<String, Room>();
        List<Room> roomList = roomRepo.findAll();
        for (int i=0; i<roomList.size(); i++) {
            rooms.put(roomList.get(i).getRoomName().trim().toUpperCase(), roomList.get(i));
        }
        // We create each new rooms from the API
        for (int i=0; i<dbFillerDTO.getRooms().size(); i++) {
            // if not filled, we use the first floor
            String floorname = dbFillerDTO.getRooms().get(i).getFloorName();
            if (dbFillerDTO.getRooms().get(i).getFloorName() == null) {
                floorname = floors.entrySet().iterator().next().getKey();
            }
            floorname = floorname.trim().toUpperCase();
            // if not filled, we have a default room name
            String roomname = dbFillerDTO.getRooms().get(i).getRoomName();
            if (roomname == null) {
                roomname = floorname+"_room_"+rooms.size();
            }
            // we put nextFloorName in upper case
            String nextFloorName = dbFillerDTO.getRooms().get(i).getNextFloor();
            if (nextFloorName != null) {
                nextFloorName = nextFloorName.trim().toUpperCase();
            }
            rooms.put(dbFillerDTO.getRooms().get(i).getRoomName().trim().toUpperCase(), roomRepo.save(
                Room.builder()
                    .roomType(roomTypes.get(dbFillerDTO.getRooms().get(i).getRoomType().trim().toUpperCase()))
                    .roomName(roomname)
                    .coordX1(dbFillerDTO.getRooms().get(i).getCoordX1()).coordZ1(dbFillerDTO.getRooms().get(i).getCoordZ1())
                    .orientationDeg(dbFillerDTO.getRooms().get(i).getOrientationDeg())
                    .openspaceNumber(dbFillerDTO.getRooms().get(i).getOpenspaceNumber())
                    .floor(floors.get(floorname))
                    .nextFloor(floors.get(nextFloorName))
                    .position(dbFillerDTO.getRooms().get(i).getPosition())
                    .build()
            ));
        }
        roomRepo.flush();

        // We get all desks in the db in a map to access them easily
        HashMap<String, Desk> desks = new HashMap<String, Desk>();
        List<Desk> deskList = deskRepo.findAll();
        HashMap<String, String> deskNames = new HashMap<String, String>();
        for (int i=0; i<deskList.size(); i++) {
            desks.put(deskList.get(i).getDeskName().trim().toUpperCase(), deskList.get(i));
            deskNames.put((deskList.get(i).getRoom().getRoomName()+"_"+deskList.get(i).getDeskType().getDeskNumber()).trim().toUpperCase(), deskList.get(i).getDeskName());
        }
        // We create each new desks from the API (we could also create them automatically with the rooms, it would be easier for the user in admin page)
        for (int i=0; i<dbFillerDTO.getDesks().size(); i++) {
            // if there is no desk number filled, we put at 1
            Integer desknumber = dbFillerDTO.getDesks().get(i).getDeskNumber();
            if (rooms.get(dbFillerDTO.getDesks().get(i).getRoomName().trim().toUpperCase()).getRoomType().getRoomtypeName().equals("Office1Desk") && (desknumber == null || desknumber == 0)) {
                desknumber = 1;
            }
            // if there is no desk name filled, we have a default value
            String deskname = dbFillerDTO.getDesks().get(i).getDeskName();
            if (deskname == null) {
                deskname = dbFillerDTO.getDesks().get(i).getRoomName()+"_"+desknumber;
            }
            desks.put(deskname.trim().toUpperCase(), deskRepo.save(
                Desk.builder()
                    .deskName(deskname)
                    .room(rooms.get(dbFillerDTO.getDesks().get(i).getRoomName().trim().toUpperCase()))
                    .deskType(deskTypes.get((rooms.get(dbFillerDTO.getDesks().get(i).getRoomName().trim().toUpperCase()).getRoomType().getRoomtypeName()+"_"+desknumber).trim().toUpperCase()))
                    .build()
            ));
            deskNames.put((dbFillerDTO.getDesks().get(i).getRoomName()+"_"+desknumber).trim().toUpperCase(),deskname.trim().toUpperCase());
        }
        deskRepo.flush();

        // We get all employees in the db in a map to access them easily
        HashMap<String, Employee> employees = new HashMap<String, Employee>();
        List<Employee> employeeList = employeeRepo.findAll();
        for (int i=0; i<employeeList.size(); i++) {
            employees.put((employeeList.get(i).getFirstName()+"_"+employeeList.get(i).getLastName()).trim().toUpperCase(), employeeList.get(i));
        }
        // We create new employees from the API
        for (int i=0; i<dbFillerDTO.getEmployees().size(); i++) {
            Desk desk = null;
            // We search the desk linked to the user (or create it)
            Integer desknumber = dbFillerDTO.getEmployees().get(i).getDeskNumber();
            String roomname = dbFillerDTO.getEmployees().get(i).getRoomName();
            if (roomname != null && rooms.get(roomname.trim().toUpperCase()).getRoomType().getRoomtypeName().equals("Office1Desk") && (desknumber == null || desknumber == 0)) {
                desknumber = 1;
            }
            if (roomname != null && desknumber != null) {
                desk = desks.get(deskNames.get((roomname+"_"+dbFillerDTO.getEmployees().get(i).getDeskNumber()).trim().toUpperCase()));
                if (desk == null) {
                    String deskname = (roomname+"_"+desknumber);
                    if (dbFillerDTO.getEmployees().get(i).getDeskName() != null) {
                        deskname = dbFillerDTO.getEmployees().get(i).getDeskName();
                    }
                    desk = deskRepo.save(
                        Desk.builder()
                            .deskName(deskname)
                            .room(rooms.get(roomname.trim().toUpperCase()))
                            .deskType(deskTypes.get((rooms.get(roomname.trim().toUpperCase()).getRoomType().getRoomtypeName()+"_"+desknumber).trim().toUpperCase()))
                            .build()
                    );
                    desks.put(deskname.trim().toUpperCase(), desk);
                    deskNames.put((roomname+"_"+desknumber).trim().toUpperCase(),deskname);
                }
            } else if (dbFillerDTO.getEmployees().get(i).getDeskName() != null) {
                desk = desks.get(dbFillerDTO.getEmployees().get(i).getDeskName().trim().toUpperCase());
            }

            // We have default value for inOffice, status, sprite
            String inoffice = dbFillerDTO.getEmployees().get(i).getInOffice();
            if (dbFillerDTO.getEmployees().get(i).getInOffice() == null) {
                inoffice = "OFFICE";
            }
            String status = dbFillerDTO.getEmployees().get(i).getStatus();
            if (dbFillerDTO.getEmployees().get(i).getStatus() == null) {
                status = "AVAILABLE";
            }
            String sprite = dbFillerDTO.getEmployees().get(i).getSprite();
            if (dbFillerDTO.getEmployees().get(i).getSprite() == null) {
                sprite = "MAN1";
            }
            employees.put((dbFillerDTO.getEmployees().get(i).getFirstName()+"_"+dbFillerDTO.getEmployees().get(i).getLastName()).trim().toUpperCase(), employeeRepo.save(
                    Employee.builder()
                        .firstName(dbFillerDTO.getEmployees().get(i).getFirstName())
                        .lastName(dbFillerDTO.getEmployees().get(i).getLastName())
                        .desk(desk)
                        .email(dbFillerDTO.getEmployees().get(i).getEmail())
                        .phoneNumber(dbFillerDTO.getEmployees().get(i).getPhoneNumber())
                        .workingHours(dbFillerDTO.getEmployees().get(i).getWorkingHours())
                        .inOffice(WorkLocation.valueOf(inoffice.trim().toUpperCase()))
                        .status(EmployeeStatus.valueOf(status.trim().toUpperCase()))
                        .sprite(Sprite.valueOf(sprite.trim().toUpperCase()))
                        .build()
            ));
        }
        employeeRepo.flush();

        // We get all accounts in the db in a map to access them easily
        HashMap<String, Account> accounts = new HashMap<String, Account>();
        List<Account> accountList = accountRepo.findAll();
        for (int i=0; i<accountList.size(); i++) {
            accounts.put(accountList.get(i).getEmail(), accountList.get(i));
        }
        // We create all new accounts from the API
        for (int i=0; i<dbFillerDTO.getAccounts().size(); i++) {
            // if not filled, the role is user
            String role = dbFillerDTO.getAccounts().get(i).getRole();
            if (role == null) {
                role = "USER";
            }
            role.trim().toUpperCase();
            // We have default value for email based on the name of the employee
            String email = dbFillerDTO.getAccounts().get(i).getEmail();
            if (email == null) {
                email = dbFillerDTO.getAccounts().get(i).getFirstName().toLowerCase()+"."+dbFillerDTO.getAccounts().get(i).getLastName().toLowerCase()+"@keliocity.com";
            }
            // The default password is mdp if not filled (the user should change it then - to be implemented)
            String password = dbFillerDTO.getAccounts().get(i).getPassword();
            if (password == null) {
                password = "mdp";
            }

            // we create the account
            Account acc = new Account();
            acc.setEmail(email);
            acc.setPassword(passwordEncoder.encode(password));
            acc.setRole(AccountRole.valueOf(role));
            acc.setEmployee(employees.get((dbFillerDTO.getAccounts().get(i).getFirstName()+"_"+dbFillerDTO.getAccounts().get(i).getLastName()).trim().toUpperCase()));
            accountRepo.save(acc);
            accounts.put(dbFillerDTO.getAccounts().get(i).getEmail(), acc);
        }
        accountRepo.flush();

        // We get all meetings in the db in a map to access them easily
        HashMap<String, Meeting> meetings = new HashMap<String, Meeting>();
        List<Meeting> meetingList = meetingRepo.findAll();
        for (int i=0; i<meetingList.size(); i++) {
            meetings.put(meetingList.get(i).getTitle().trim().toUpperCase(), meetingList.get(i));
        }
        // We create new meetings from the API
        for (int i=0; i<dbFillerDTO.getMeetings().size(); i++) {
            // We search the room and desk linked to the meeting
            Integer desknumber = dbFillerDTO.getMeetings().get(i).getDeskNumber();
            if (rooms.get(dbFillerDTO.getMeetings().get(i).getRoomName().trim().toUpperCase()).getRoomType().getRoomtypeName().equals("Office1Desk") && desknumber == null) {
                desknumber = 1;
            }
            String deskname = dbFillerDTO.getMeetings().get(i).getDeskName();
            if (deskname == null && desknumber != null) {
                deskname = deskNames.get((dbFillerDTO.getMeetings().get(i).getRoomName()+"_"+desknumber).trim().toUpperCase());
            }
            if (deskname != null) {
                deskname = deskname.trim().toUpperCase();
            }
            meetings.put(dbFillerDTO.getMeetings().get(i).getTitle().trim().toUpperCase(), meetingRepo.save(
                    Meeting.builder()
                        .room(rooms.get(dbFillerDTO.getMeetings().get(i).getRoomName().trim().toUpperCase()))
                        .desk(desks.get(deskname))
                        .title(dbFillerDTO.getMeetings().get(i).getTitle())
                        .startingHour(dbFillerDTO.getMeetings().get(i).getStartingHour()) // format YYYY-MM-DDTHH:mm:ss (ex: 2026-02-12T21:31:00)
                        .endHour(dbFillerDTO.getMeetings().get(i).getEndHour()) // format YYYY-MM-DDTHH:mm:ss (ex: 2026-02-12T21:31:00)
                        .description(dbFillerDTO.getMeetings().get(i).getDescription())
                        .build()
                ));
        }
        meetingRepo.flush();

        // We get all meetingEmployees in the db in a map to access them easily
        HashMap<String, MeetingEmployee> meetingEmployees = new HashMap<String, MeetingEmployee>();
        List<MeetingEmployee> meetingEmployeeList = meetingEmployeeRepo.findAll();
        for (int i=0; i<meetingEmployeeList.size(); i++) {
            meetingEmployees.put((meetingEmployeeList.get(i).getEmployee().getFirstName()+"_"+meetingEmployeeList.get(i).getEmployee().getLastName()+"_"+meetingEmployeeList.get(i).getMeeting().getTitle()).trim().toUpperCase(), meetingEmployeeList.get(i));
        }
        // We create each new meetingEmployees from the API
        for (int i=0; i<dbFillerDTO.getMeetingEmployees().size(); i++) {
            meetingEmployees.put((dbFillerDTO.getMeetingEmployees().get(i).getEmployeeFirstName()+"_"+dbFillerDTO.getMeetingEmployees().get(i).getEmployeeLastName()+"_"+dbFillerDTO.getMeetingEmployees().get(i).getMeetingTitle()).trim().toUpperCase(), meetingEmployeeRepo.save(
                    new MeetingEmployee(
                        meetings.get(dbFillerDTO.getMeetingEmployees().get(i).getMeetingTitle().trim().toUpperCase()),
                        employees.get((dbFillerDTO.getMeetingEmployees().get(i).getEmployeeFirstName()+"_"+dbFillerDTO.getMeetingEmployees().get(i).getEmployeeLastName()).trim().toUpperCase()),
                        dbFillerDTO.getMeetingEmployees().get(i).getPresent(),
                        dbFillerDTO.getMeetingEmployees().get(i).getRemote()
                )));
        }
        meetingEmployeeRepo.flush();

        return "done";
    }
}