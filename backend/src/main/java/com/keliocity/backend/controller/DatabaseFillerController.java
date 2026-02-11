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
        for (int i=0; i<deskList.size(); i++) {
            desks.put(deskList.get(i).getDeskName(), deskList.get(i));
        }
        for (int i=0; i<dbFillerDTO.getDesks().size(); i++) {
            desks.put(dbFillerDTO.getDesks().get(i).getDeskName(), deskRepo.save(
                Desk.builder()
                    .deskName(dbFillerDTO.getDesks().get(i).getDeskName())
                    .room(rooms.get(dbFillerDTO.getDesks().get(i).getRoomName()))
                    .deskType(deskTypes.get(rooms.get(dbFillerDTO.getDesks().get(i).getRoomName()).getRoomType().getRoomtypeName()+"_"+dbFillerDTO.getDesks().get(i).getDeskNumber()))
                    .build()
            ));
        }
        deskRepo.flush();

        return "done";
    }
}