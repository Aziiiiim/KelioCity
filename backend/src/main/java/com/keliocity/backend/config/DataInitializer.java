package com.keliocity.backend.config;

import com.keliocity.backend.model.*;
import com.keliocity.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoomRepository roomRepo;
    private final DeskRepository deskRepo;
    private final EmployeeRepository employeeRepo;
    private final RoomTypeRepository roomTypeRepo;

    public DataInitializer(RoomRepository roomRepo,
                           DeskRepository deskRepo,
                           EmployeeRepository employeeRepo,
                           RoomTypeRepository roomTypeRepo) {
        this.roomRepo = roomRepo;
        this.deskRepo = deskRepo;
        this.employeeRepo = employeeRepo;
        this.roomTypeRepo = roomTypeRepo;
    }

    @Override
    public void run(String... args) {

        if (roomRepo.count() == 0) {
            System.out.println("➡️ Initialisation de la base de données…");

            // --- ROOM TYPE ---
            RoomType meetingRoom = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("MeetingRoom")
                        .lengthX(10.7)
                        .lengthZ(6)
                        .build()
            )

            RoomType office = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office")
                        .lengthX(6)
                        .lengthZ(4)
                        .build()
            )

            RoomType openspace = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Openspace")
                        .lengthX(2.52)
                        .lengthZ(3.85)
                        .build()
            )

            // --- ROOMS ---
            Room roomA101 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A101")
                        .coordX1(-25).coordZ1(-25)
                        .orientationDeg(0)
                        .build()
            );

            Room roomA102 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A102")
                        .coordX1(-25).coordZ1(-19)
                        .orientationDeg(0)
                        .build()
            );

            Room roomA103 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A103")
                        .coordX1(14).coordZ1(0)
                        .orientationDeg(90)
                        .build()
            );

            Room roomA104 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A104")
                        .coordX1(2).coordZ1(0)
                        .orientationDeg(90)
                        .build()
            );

            Room roomA104 = roomRepo.save(
                    Room.builder()
                        .roomType(office)
                        .roomName("A104")
                        .coordX1(19).coordZ1(-25)
                        .orientationDeg(0)
                        .build()
            );

            Room roomA105 = roomRepo.save(
                    Room.builder()
                        .roomType(office)
                        .roomName("A105")
                        .coordX1(13).coordZ1(-25)
                        .orientationDeg(0)
                        .build()
            );

            Room roomA106 = roomRepo.save(
                    Room.builder()
                        .roomType(office)
                        .roomName("A106")
                        .coordX1(7).coordZ1(-25)
                        .orientationDeg(0)
                        .build()
            );

            Room roomA107 = roomRepo.save(
                    Room.builder()
                        .roomType(office)
                        .roomName("A107")
                        .coordX1(1).coordZ1(-25)
                        .orientationDeg(0)
                        .build()
            );

            Room openspace_1 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_001")
                        .coordX1(-22).coordZ1(18)
                        .orientationDeg(0)
                        .openspaceNumber(7)
                        .build()
            );

            Room openspace_2 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_002")
                        .coordX1(-22).coordZ1(10)
                        .orientationDeg(0)
                        .openspaceNumber(7)
                        .build()
            );

            Room openspace_3 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_003")
                        .coordX1(-22).coordZ1(2)
                        .orientationDeg(0)
                        .openspaceNumber(5)
                        .build()
            );

            Room openspace_4 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_004")
                        .coordX1(16).coordZ1(-14)
                        .orientationDeg(90)
                        .openspaceNumber(10)
                        .build()
            );

            Room openspace_5 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_005")
                        .coordX1(4).coordZ1(-14)
                        .orientationDeg(90)
                        .openspaceNumber(10)
                        .build()
            );


            // --- DESKS ---
            Desk desk1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A1")
                        .room(roomA)
                        .coordX(5f)
                        .coordZ(5f)
                        .build()
            );

            Desk desk2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A2")
                        .room(roomA)
                        .coordX(7f)
                        .coordZ(5f)
                        .build()
            );

            // --- EMPLOYEES ---
            employeeRepo.save(
                    Employee.builder()
                        .firstName("Alice")
                        .lastName("Dupont")
                        .desk(desk1)
                        .email("alice@keliocity.com")
                        .phoneNumber("0601020304")
                        .workingHours("09:00-17:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.AVAILABLE)
                        .build()
            );

            employeeRepo.save(
                    Employee.builder()
                        .firstName("Bob")
                        .lastName("Martin")
                        .desk(desk2)
                        .email("bob@keliocity.com")
                        .phoneNumber("0611223344")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.REMOTE)
                        .status(EmployeeStatus.OCCUPIED)
                        .build()
            );

            System.out.println("✔ Base de données initialisée !");
        }
    }
}
