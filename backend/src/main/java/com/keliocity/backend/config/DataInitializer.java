package com.keliocity.backend.config;

import com.keliocity.backend.model.*;
import com.keliocity.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;


@Component
public class DataInitializer implements CommandLineRunner {

    private final RoomRepository roomRepo;
    private final DeskRepository deskRepo;
    private final EmployeeRepository employeeRepo;
    private final RoomTypeRepository roomTypeRepo;
    private final MeetingRepository meetingRepo;
    private final MeetingEmployeeRepository meetingEmployeeRepo;

    public DataInitializer(RoomRepository roomRepo,
                           DeskRepository deskRepo,
                           EmployeeRepository employeeRepo,
                           RoomTypeRepository roomTypeRepo,
                           MeetingRepository meetingRepo,
                           MeetingEmployeeRepository meetingEmployeeRepo) {
        this.roomRepo = roomRepo;
        this.deskRepo = deskRepo;
        this.employeeRepo = employeeRepo;
        this.roomTypeRepo = roomTypeRepo;
        this.meetingRepo = meetingRepo;
        this.meetingEmployeeRepo = meetingEmployeeRepo;
    }

    @Override
    public void run(String... args) {

        if (roomRepo.count() == 0) {
            System.out.println("➡️ Initialisation de la base de données…");

            // --- ROOM TYPE ---
            RoomType meetingRoom = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("MeetingRoom")
                        .lengthX(10.7f)
                        .lengthZ(6f)
                        .build()
            );

            RoomType office = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office")
                        .lengthX(6f)
                        .lengthZ(4f)
                        .build()
            );

            RoomType openspace = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Openspace")
                        .lengthX(2.52f)
                        .lengthZ(3.85f)
                        .build()
            );

            // --- ROOMS ---
            Room roomA101 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A101")
                        .coordX1(-25f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA102 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A102")
                        .coordX1(-25f).coordZ1(-19f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA103 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A103")
                        .coordX1(14f).coordZ1(0f)
                        .orientationDeg(90f)
                        .build()
            );

            Room roomA104 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A104")
                        .coordX1(2f).coordZ1(0f)
                        .orientationDeg(90f)
                        .build()
            );

            Room roomA105 = roomRepo.save(
                    Room.builder()
                        .roomType(office)
                        .roomName("A104")
                        .coordX1(19f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA106 = roomRepo.save(
                    Room.builder()
                        .roomType(office)
                        .roomName("A105")
                        .coordX1(13f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA107 = roomRepo.save(
                    Room.builder()
                        .roomType(office)
                        .roomName("A106")
                        .coordX1(7f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA108 = roomRepo.save(
                    Room.builder()
                        .roomType(office)
                        .roomName("A107")
                        .coordX1(1f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room openspace_1 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_001")
                        .coordX1(-22f).coordZ1(18f)
                        .orientationDeg(0f)
                        .openspaceNumber(7)
                        .build()
            );

            Room openspace_2 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_002")
                        .coordX1(-22f).coordZ1(10f)
                        .orientationDeg(0f)
                        .openspaceNumber(7)
                        .build()
            );

            Room openspace_3 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_003")
                        .coordX1(-22f).coordZ1(2f)
                        .orientationDeg(0f)
                        .openspaceNumber(5)
                        .build()
            );

            Room openspace_4 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_004")
                        .coordX1(16f).coordZ1(-14f)
                        .orientationDeg(90f)
                        .openspaceNumber(10)
                        .build()
            );

            Room openspace_5 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_005")
                        .coordX1(4f).coordZ1(-14f)
                        .orientationDeg(90f)
                        .openspaceNumber(10)
                        .build()
            );


            // --- DESKS ---
            Desk deskA105 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A105")
                        .room(roomA105)
                        .coordX(10.3f).coordZ(-16f)
                        .build()
            );

            Desk deskA106 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A106")
                        .room(roomA106)
                        .coordX(4.3f).coordZ(-16f)
                        .build()
            );

            Desk deskA107 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A107")
                        .room(roomA107)
                        .coordX(-2.3f).coordZ(-16f)
                        .build()
            );


            Desk deskA108 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108")
                        .room(roomA108)
                        .coordX(-6.3f).coordZ(-16f)
                        .build()
            );

            // --- EMPLOYEES ---
            Employee alice = employeeRepo.save(
                    Employee.builder()
                        .firstName("Alice")
                        .lastName("Dupont")
                        .desk(deskA105)
                        .email("alice@keliocity.com")
                        .phoneNumber("0601020304")
                        .workingHours("09:00-17:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.AVAILABLE)
                        .sprite(Sprite.WOMAN1)
                        .build()
            );

            Employee bob = employeeRepo.save(
                    Employee.builder()
                        .firstName("Bob")
                        .lastName("Martin")
                        .desk(deskA106)
                        .email("bob@keliocity.com")
                        .phoneNumber("0611223344")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.REMOTE)
                        .status(EmployeeStatus.OCCUPIED)
                        .sprite(Sprite.MAN1)
                        .build()
            );

            Employee jade = employeeRepo.save(
                    Employee.builder()
                        .firstName("Jade")
                        .lastName("Bernard")
                        .desk(deskA107)
                        .email("jade@keliocity.com")
                        .phoneNumber("0611020777")
                        .workingHours("09:00-17:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.AVAILABLE)
                        .sprite(Sprite.WOMAN2)
                        .build()
            );

            Employee paul = employeeRepo.save(
                    Employee.builder()
                        .firstName("Paul")
                        .lastName("Lefevre")
                        .desk(deskA108)
                        .email("paul@keliocity.com")
                        .phoneNumber("0681283384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.REMOTE)
                        .status(EmployeeStatus.OCCUPIED)
                        .sprite(Sprite.MAN2)
                        .build()
            );

            Meeting meeting = meetingRepo.save(
                    Meeting.builder()
                        .room(roomA101)
                        .title("Réunion de rentrée")
                        .startingHour(LocalDateTime.of(2025,11,25,9,30))
                        .endHour(LocalDateTime.of(2025,11,25,10,30))
                        .description("Première réunion")
                        .build()
            );

            meetingEmployeeRepo.save(
                    MeetingEmployee.builder()
                        .meeting(meeting)
                        .employee(jade)
                        .present(true)
                        .remote(false)
                        .build()
            );

            meetingEmployeeRepo.save(
                    MeetingEmployee.builder()
                        .meeting(meeting)
                        .employee(bob)
                        .present(true)
                        .remote(false)
                        .build()
            );

            System.out.println("✔ Base de données initialisée !");
        }
    }
}
