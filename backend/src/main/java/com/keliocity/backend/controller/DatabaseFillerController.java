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
    private final EmployeeRepository employeeRepo;
    private final FloorRepository floorRepo;
    private final MeetingEmployeeRepository meetingEmployeeRepo;
    private final MeetingRepository meetingRepo;
    private final RoomRepository roomRepo;
    private final RoomTypeRepository roomTypeRepo;


    public DatabaseFillerController(DeskRepository deskRepo, EmployeeRepository employeeRepo, FloorRepository floorRepo, MeetingEmployeeRepository meetingEmployeeRepo, MeetingRepository meetingRepo, RoomRepository roomRepo, RoomTypeRepository roomTypeRepo) {
        this.deskRepo = deskRepo;
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
        /*roomTypes.put("MeetingRoom", roomTypeRepo.save(
            RoomType.builder()
                .roomtypeName("MeetingRoom")
                .lengthX(15f)
                .lengthZ(12f)
                .build()
        ));

        roomTypes.put("Office1Desk", roomTypeRepo.save(
            RoomType.builder()
                .roomtypeName("Office1Desk")
                .lengthX(6f)
                .lengthZ(4f)
                .build()
        ));

        roomTypes.put("Office2Desks", roomTypeRepo.save(
            RoomType.builder()
                .roomtypeName("Office2Desks")
                .lengthX(5f)
                .lengthZ(6f)
                .build()
        ));

        roomTypes.put("Office4Desks", roomTypeRepo.save(
            RoomType.builder()
                .roomtypeName("Office4Desks")
                .lengthX(7f)
                .lengthZ(6f)
                .build()
        ));

        roomTypes.put("Office6Desks", roomTypeRepo.save(
            RoomType.builder()
                .roomtypeName("Office6Desks")
                .lengthX(7f)
                .lengthZ(9f)
                .build()
        ));

        roomTypes.put("Openspace", roomTypeRepo.save(
            RoomType.builder()
                .roomtypeName("Openspace")
                .lengthX(2.52f)
                .lengthZ(3.85f)
                .build()
        ));

        roomTypes.put("Stairs", roomTypeRepo.save(
            RoomType.builder()
                .roomtypeName("Stairs")
                .lengthX(5f)
                .lengthZ(3f)
                .build()
        ));*/

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

        for (int i=0; i<dbFillerDTO.getRooms().size(); i++) {
            roomRepo.save(
                Room.builder()
                    .roomType(roomTypes.get(dbFillerDTO.getRooms().get(i).getRoomType()))
                    .roomName(dbFillerDTO.getRooms().get(i).getRoomName())
                    .coordX1(dbFillerDTO.getRooms().get(i).getCoordX1()).coordZ1(dbFillerDTO.getRooms().get(i).getCoordZ1())
                    .orientationDeg(dbFillerDTO.getRooms().get(i).getOrientationDeg())
                    .openspaceNumber(dbFillerDTO.getRooms().get(i).getOpenspaceNumber())
                    .floor(floors.get(dbFillerDTO.getRooms().get(i).getFloorName()))
                    .build()
            );
        }
        roomRepo.flush();

        return "done";
    }
}
