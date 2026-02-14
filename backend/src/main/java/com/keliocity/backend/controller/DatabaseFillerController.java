package com.keliocity.backend.controller;

import java.util.List;
import java.util.HashMap;

import com.keliocity.backend.model.dto.*;
import com.keliocity.backend.model.*;
import com.keliocity.backend.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

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


    public DatabaseFillerController(DeskRepository deskRepo, EmployeeRepository employeeRepo, FloorRepository floorRepo, MeetingEmployeeRepository meetingEmployeeRepo, MeetingRepository meetingRepo, RoomRepository roomRepo, RoomTypeRepository roomTypeRepo, DeskTypeRepository deskTypeRepo) {
        this.deskRepo = deskRepo;
        this.deskTypeRepo = deskTypeRepo;
        this.employeeRepo = employeeRepo;
        this.floorRepo = floorRepo;
        this.meetingEmployeeRepo = meetingEmployeeRepo;
        this.meetingRepo = meetingRepo;
        this.roomRepo = roomRepo;
        this.roomTypeRepo = roomTypeRepo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String create(@RequestBody DatabaseFillerDTO dbFillerDTO) {
        if (dbFillerDTO.getReset()) {
            meetingEmployeeRepo.deleteAll();
            meetingRepo.deleteAll();
            employeeRepo.deleteAll();
            deskRepo.deleteAll();
            roomRepo.deleteAll();
            floorRepo.deleteAll();
        }

        HashMap<String, RoomType> roomTypes = new HashMap<String, RoomType>();
        List<RoomType> roomTypeList = roomTypeRepo.findAll();
        for (int i=0; i<roomTypeList.size(); i++) {
            roomTypes.put(roomTypeList.get(i).getRoomtypeName(), roomTypeList.get(i));
        }
        HashMap<String, DeskType> deskTypes = new HashMap<String, DeskType>();
        List<DeskType> deskTypeList = deskTypeRepo.findAll();
        for (int i=0; i<deskTypeList.size(); i++) {
            deskTypes.put(deskTypeList.get(i).getRoomType().getRoomtypeName()+"_"+deskTypeList.get(i).getDeskNumber(), deskTypeList.get(i));
        }

        HashMap<String, Floor> floors = new HashMap<String, Floor>();
        List<Floor> floorList = floorRepo.findAll();
        for (int i=0; i<floorList.size(); i++) {
            floors.put(floorList.get(i).getFloorName(), floorList.get(i));
        }
        for (int i=0; i<dbFillerDTO.getFloors().size(); i++) {
            floors.put(dbFillerDTO.getFloors().get(i).getFloorName(), floorRepo.save(
                Floor.builder()
                    .floorName(dbFillerDTO.getFloors().get(i).getFloorName())
                    .lengthX(dbFillerDTO.getFloors().get(i).getLengthX())
                    .lengthZ(dbFillerDTO.getFloors().get(i).getLengthZ())
                    .build()
            ));
        }
        floorRepo.flush();

        HashMap<String, Room> rooms = new HashMap<String, Room>();
        List<Room> roomList = roomRepo.findAll();
        for (int i=0; i<roomList.size(); i++) {
            rooms.put(roomList.get(i).getRoomName(), roomList.get(i));
        }
        for (int i=0; i<dbFillerDTO.getRooms().size(); i++) {
            rooms.put(dbFillerDTO.getRooms().get(i).getRoomName(), roomRepo.save(
                Room.builder()
                    .roomType(roomTypes.get(dbFillerDTO.getRooms().get(i).getRoomType()))
                    .roomName(dbFillerDTO.getRooms().get(i).getRoomName())
                    .coordX1(dbFillerDTO.getRooms().get(i).getCoordX1()).coordZ1(dbFillerDTO.getRooms().get(i).getCoordZ1())
                    .orientationDeg(dbFillerDTO.getRooms().get(i).getOrientationDeg())
                    .openspaceNumber(dbFillerDTO.getRooms().get(i).getOpenspaceNumber())
                    .floor(floors.get(dbFillerDTO.getRooms().get(i).getFloorName()))
                    .build()
            ));
        }
        roomRepo.flush();

        HashMap<String, Desk> desks = new HashMap<String, Desk>();
        List<Desk> deskList = deskRepo.findAll();
        HashMap<String, String> deskNames = new HashMap<String, String>();
        for (int i=0; i<deskList.size(); i++) {
            desks.put(deskList.get(i).getDeskName(), deskList.get(i));
            deskNames.put(deskList.get(i).getRoom().getRoomName()+"_"+deskList.get(i).getDeskType().getDeskNumber(), deskList.get(i).getDeskName());
        }
        for (int i=0; i<dbFillerDTO.getDesks().size(); i++) {
            desks.put(dbFillerDTO.getDesks().get(i).getDeskName(), deskRepo.save(
                Desk.builder()
                    .deskName(dbFillerDTO.getDesks().get(i).getDeskName())
                    .room(rooms.get(dbFillerDTO.getDesks().get(i).getRoomName()))
                    .deskType(deskTypes.get(rooms.get(dbFillerDTO.getDesks().get(i).getRoomName()).getRoomType().getRoomtypeName()+"_"+dbFillerDTO.getDesks().get(i).getDeskNumber()))
                    .build()
            ));
            deskNames.put(dbFillerDTO.getDesks().get(i).getRoomName()+"_"+dbFillerDTO.getDesks().get(i).getDeskNumber(),dbFillerDTO.getDesks().get(i).getDeskName());
        }
        deskRepo.flush();

        HashMap<String, Employee> employees = new HashMap<String, Employee>();
        List<Employee> employeeList = employeeRepo.findAll();
        for (int i=0; i<employeeList.size(); i++) {
            employees.put(employeeList.get(i).getFirstName()+"_"+employeeList.get(i).getLastName(), employeeList.get(i));
        }
        Desk desk = null;
        for (int i=0; i<dbFillerDTO.getEmployees().size(); i++) {
            if (dbFillerDTO.getEmployees().get(i).getRoomName() != null && dbFillerDTO.getEmployees().get(i).getDeskNumber() != null) {
                desk = desks.get(deskNames.get(dbFillerDTO.getEmployees().get(i).getRoomName()+"_"+dbFillerDTO.getEmployees().get(i).getDeskNumber()));
                if (desk == null) {
                    String deskname = dbFillerDTO.getEmployees().get(i).getRoomName()+"_"+dbFillerDTO.getEmployees().get(i).getDeskNumber();
                    if (dbFillerDTO.getEmployees().get(i).getDeskName() != null) {
                        deskname = dbFillerDTO.getEmployees().get(i).getDeskName();
                    }
                    desk = deskRepo.save(
                        Desk.builder()
                            .deskName(deskname)
                            .room(rooms.get(dbFillerDTO.getEmployees().get(i).getRoomName()))
                            .deskType(deskTypes.get(rooms.get(dbFillerDTO.getEmployees().get(i).getRoomName()).getRoomType().getRoomtypeName()+"_"+dbFillerDTO.getEmployees().get(i).getDeskNumber()))
                            .build()
                    );
                    desks.put(deskname, desk);
                    deskNames.put(dbFillerDTO.getEmployees().get(i).getRoomName()+"_"+dbFillerDTO.getEmployees().get(i).getDeskNumber(),deskname);
                }
            } else if (dbFillerDTO.getEmployees().get(i).getDeskName() != null) {
                desk = desks.get(dbFillerDTO.getEmployees().get(i).getDeskName());
            }

            employees.put(dbFillerDTO.getEmployees().get(i).getFirstName()+"_"+dbFillerDTO.getEmployees().get(i).getLastName(), employeeRepo.save(
                    Employee.builder()
                        .firstName(dbFillerDTO.getEmployees().get(i).getFirstName())
                        .lastName(dbFillerDTO.getEmployees().get(i).getLastName())
                        .desk(desk)
                        .email(dbFillerDTO.getEmployees().get(i).getEmail())
                        .phoneNumber(dbFillerDTO.getEmployees().get(i).getPhoneNumber())
                        .workingHours(dbFillerDTO.getEmployees().get(i).getWorkingHours())
                        .inOffice(WorkLocation.valueOf(dbFillerDTO.getEmployees().get(i).getInOffice().trim().toUpperCase()))
                        .status(EmployeeStatus.valueOf(dbFillerDTO.getEmployees().get(i).getStatus().trim().toUpperCase()))
                        .sprite(Sprite.valueOf(dbFillerDTO.getEmployees().get(i).getSprite().trim().toUpperCase()))
                        .build()
            ));
        }
        employeeRepo.flush();

        HashMap<String, Meeting> meetings = new HashMap<String, Meeting>();
        List<Meeting> meetingList = meetingRepo.findAll();
        for (int i=0; i<meetingList.size(); i++) {
            meetings.put(meetingList.get(i).getTitle(), meetingList.get(i));
        }
        for (int i=0; i<dbFillerDTO.getMeetings().size(); i++) {
            String deskname = dbFillerDTO.getMeetings().get(i).getDeskName();
            if (deskname == null && dbFillerDTO.getMeetings().get(i).getDeskNumber() != null) {
                deskname = deskNames.get(dbFillerDTO.getMeetings().get(i).getRoomName()+"_"+dbFillerDTO.getMeetings().get(i).getDeskNumber());
            }
            meetings.put(dbFillerDTO.getMeetings().get(i).getTitle(), meetingRepo.save(
                    Meeting.builder()
                        .room(rooms.get(dbFillerDTO.getMeetings().get(i).getRoomName()))
                        .desk(desks.get(deskname))
                        .title(dbFillerDTO.getMeetings().get(i).getTitle())
                        .startingHour(dbFillerDTO.getMeetings().get(i).getStartingHour()) // format YYYY-MM-DDTHH:mm:ss (ex: 2026-02-12T21:31:00)
                        .endHour(dbFillerDTO.getMeetings().get(i).getEndHour()) // format YYYY-MM-DDTHH:mm:ss (ex: 2026-02-12T21:31:00)
                        .description(dbFillerDTO.getMeetings().get(i).getDescription())
                        .build()
                ));
        }
        meetingRepo.flush();

        HashMap<String, MeetingEmployee> meetingEmployees = new HashMap<String, MeetingEmployee>();
        List<MeetingEmployee> meetingEmployeeList = meetingEmployeeRepo.findAll();
        for (int i=0; i<meetingEmployeeList.size(); i++) {
            meetingEmployees.put(meetingEmployeeList.get(i).getEmployee().getFirstName()+"_"+meetingEmployeeList.get(i).getEmployee().getLastName()+"_"+meetingEmployeeList.get(i).getMeeting().getTitle(), meetingEmployeeList.get(i));
        }
        for (int i=0; i<dbFillerDTO.getMeetingEmployees().size(); i++) {
            meetingEmployees.put(dbFillerDTO.getMeetingEmployees().get(i).getEmployeeFirstName()+"_"+dbFillerDTO.getMeetingEmployees().get(i).getEmployeeLastName()+"_"+dbFillerDTO.getMeetingEmployees().get(i).getMeetingTitle(), meetingEmployeeRepo.save(
                    new MeetingEmployee(
                        meetings.get(dbFillerDTO.getMeetingEmployees().get(i).getMeetingTitle()),
                        employees.get(dbFillerDTO.getMeetingEmployees().get(i).getEmployeeFirstName()+"_"+dbFillerDTO.getMeetingEmployees().get(i).getEmployeeLastName()),
                        dbFillerDTO.getMeetingEmployees().get(i).getPresent(),
                        dbFillerDTO.getMeetingEmployees().get(i).getRemote()
                )));
        }
        meetingEmployeeRepo.flush();

        return "done";
    }
}