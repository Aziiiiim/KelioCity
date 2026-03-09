package com.keliocity.backend.config;

import com.keliocity.backend.model.*;
import com.keliocity.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoomRepository roomRepo;
    private final DeskRepository deskRepo;
    private final EmployeeRepository employeeRepo;
    private final RoomTypeRepository roomTypeRepo;
    private final MeetingRepository meetingRepo;
    private final MeetingEmployeeRepository meetingEmployeeRepo;
    private final FloorRepository floorRepo;
    private final DeskTypeRepository deskTypeRepo;
    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoomRepository roomRepo,
                           DeskRepository deskRepo,
                           EmployeeRepository employeeRepo,
                           RoomTypeRepository roomTypeRepo,
                           MeetingRepository meetingRepo,
                           MeetingEmployeeRepository meetingEmployeeRepo,
                           FloorRepository floorRepo,
                           DeskTypeRepository deskTypeRepo,
                           AccountRepository accountRepo,
                           PasswordEncoder passwordEncoder) {
        this.roomRepo = roomRepo;
        this.deskRepo = deskRepo;
        this.employeeRepo = employeeRepo;
        this.roomTypeRepo = roomTypeRepo;
        this.meetingRepo = meetingRepo;
        this.meetingEmployeeRepo = meetingEmployeeRepo;
        this.floorRepo = floorRepo;
        this.deskTypeRepo = deskTypeRepo;
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
    }
    
    private Employee createEmployeeWithAccount(
            String firstName,
            String lastName,
            Desk desk,
            String email,
            String phoneNumber,
            String workingHours,
            WorkLocation inOffice,
            EmployeeStatus status,
            Sprite sprite) {
        Employee emp = Employee.builder()
                .firstName(firstName)
                .lastName(lastName)
                .desk(desk)
                .email(email)
                .phoneNumber(phoneNumber)
                .workingHours(workingHours)
                .inOffice(inOffice)
                .status(status)
                .sprite(sprite)
                .build();

        Account acc = new Account();
        acc.setEmail(email);
        acc.setPassword(passwordEncoder.encode("mdp"));
        acc.setRole(AccountRole.USER);
        acc.setEmployee(emp);

        accountRepo.save(acc);
        return acc.getEmployee();
    }

    private boolean shouldCreateEmployeeOnDeskD(int j, int i) {
        return (i + j) % 2 == 0;
    }

    private boolean shouldCreateEmployeeOnDeskG(int j, int i) {
        return (i + j) % 2 != 0;
    }
    
    @Override
    @Transactional
    public void run(String... args) {

        if (roomRepo.count() == 0) {
            System.out.println("➡️ Initialisation de la base de données…");

            // --- FLOOR ---
            Floor floor1 = floorRepo.save(
                    Floor.builder()
                        .floorName("Etage1")
                        .lengthX(50f)
                        .lengthZ(50f)
                        .build()
            );

            Floor floor2 = floorRepo.save(
                    Floor.builder()
                        .floorName("Etage2")
                        .lengthX(60f)
                        .lengthZ(24f)
                        .build()
            );

            Floor floorForum = floorRepo.save(
                    Floor.builder()
                        .floorName("Forum")
                        .lengthX(80f)
                        .lengthZ(60f)
                        .build()
            );

            // --- ROOM TYPE ---
            RoomType meetingRoom = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("MeetingRoom")
                        .lengthX(15f)
                        .lengthZ(12f)
                        .build()
            );

            RoomType forum = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Forum")
                        .lengthX(80f)
                        .lengthZ(50f)
                        .build()
            );

            RoomType standForum = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("StandForum")
                        .lengthX(10f)
                        .lengthZ(10f)
                        .build()
            );

            RoomType office1Desk = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office1Desk")
                        .lengthX(6f)
                        .lengthZ(4f)
                        .build()
            );

            RoomType office2Desks = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office2Desks")
                        .lengthX(5f)
                        .lengthZ(6f)
                        .build()
            );

            RoomType office4Desks = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office4Desks")
                        .lengthX(7f)
                        .lengthZ(6f)
                        .build()
            );

            RoomType office6Desks = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office6Desks")
                        .lengthX(7f)
                        .lengthZ(9f)
                        .build()
            );

            RoomType openspace = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Openspace")
                        .lengthX(2.52f)
                        .lengthZ(3.85f)
                        .build()
            );

            RoomType stairs = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Stairs")
                        .lengthX(5f)
                        .lengthZ(3f)
                        .build()
            );
            // --- DESK TYPE ---
            DeskType desk1office1desk = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(3.1f)
                        .coordZ(2f)
                        .orientationDeg(0f)
                        .roomType(office1Desk)
                        .deskNumber(1)
                        .build()
            );

            DeskType desk1office2desks = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(3.75f)
                        .coordZ(3.905f)
                        .orientationDeg(90f)
                        .roomType(office2Desks)
                        .deskNumber(1)
                        .build()
            );

            DeskType desk2office2desks = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.25f)
                        .coordZ(2.255f)
                        .orientationDeg(-90f)
                        .roomType(office2Desks)
                        .deskNumber(2)
                        .build()
            );

            DeskType desk1office4desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(2.225f)
                            .coordZ(1.67f)
                            .orientationDeg(90f)
                            .roomType(office4Desks)
                            .deskNumber(1)
                            .build()
            );

            DeskType desk2office4desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(2.238f)
                            .coordZ(3.955f)
                            .orientationDeg(90f)
                            .roomType(office4Desks)
                            .deskNumber(2)
                            .build()
            );

            DeskType desk3office4desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(4.699f)
                            .coordZ(2.25f)
                            .orientationDeg(-90f)
                            .roomType(office4Desks)
                            .deskNumber(3)
                            .build()
            );

            DeskType desk4office4desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(4.699f)
                            .coordZ(4.5f)
                            .orientationDeg(-90f)
                            .roomType(office4Desks)
                            .deskNumber(4)
                            .build()
            );

            DeskType desk1office6desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(4.7f)
                            .coordZ(2.8f)
                            .orientationDeg(-90f)
                            .roomType(office6Desks)
                            .deskNumber(1)
                            .build()
            );

            DeskType desk2office6desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(2.2f)
                            .coordZ(2.2f)
                            .orientationDeg(90f)
                            .roomType(office6Desks)
                            .deskNumber(2)
                            .build()
            );

            DeskType desk3office6desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(4.7f)
                            .coordZ(5.05f)
                            .orientationDeg(-90f)
                            .roomType(office6Desks)
                            .deskNumber(3)
                            .build()
            );

            DeskType desk4office6desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(2.2f)
                            .coordZ(4.45f)
                            .orientationDeg(90f)
                            .roomType(office6Desks)
                            .deskNumber(4)
                            .build()
            );

            DeskType desk5office6desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(4.7f)
                            .coordZ(7.3f)
                            .orientationDeg(-90f)
                            .roomType(office6Desks)
                            .deskNumber(5)
                            .build()
            );

            DeskType desk6office6desks = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(2.2f)
                            .coordZ(6.7f)
                            .orientationDeg(90f)
                            .roomType(office6Desks)
                            .deskNumber(6)
                            .build()
            );

            DeskType desk1StandForum = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(0.7f)
                            .coordZ(-0.1f)
                            .orientationDeg(135f)
                            .roomType(standForum)
                            .build()
            );
            DeskType desk2StandForum = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(0f)
                            .coordZ(-0.9f)
                            .orientationDeg(135f)
                            .roomType(standForum)
                            .build()
            );

            // --- ROOMS ---

            Room roomForum = roomRepo.save(
                    Room.builder()
                        .roomType(forum)
                        .roomName("Forum")
                        .coordX1(-40f).coordZ1(-30f)
                        .orientationDeg(0f)
                        .floor(floorForum)
                        .build()
            );

            for (int i=0; i<6; i++) {

                Room standForumA = roomRepo.save(
                        Room.builder()
                            .roomType(standForum)
                            .roomName("StandA"+i)
                            .coordX1(-35f+i*7f).coordZ1(-25f)
                            .orientationDeg(-90f)
                            .floor(floorForum)
                            .build()
                );
                Room standForumB = roomRepo.save(
                        Room.builder()
                            .roomType(standForum)
                            .roomName("StandB"+i)
                            .coordX1(-25f+i*7f).coordZ1(-12f)
                            .orientationDeg(0f)
                            .floor(floorForum)
                            .build()
                );
            }

            Room stairsForum1A = roomRepo.save(
                    Room.builder()
                        .roomType(stairs)
                        .roomName("Escalier 1A Forum")
                        .coordX1(25f).coordZ1(3f)
                        .orientationDeg(90f)
                        .floor(floorForum)
                        .build()
            );
            Room stairsForum1B = roomRepo.save(
                    Room.builder()
                        .roomType(stairs)
                        .roomName("Escalier 1B Forum")
                        .coordX1(28f).coordZ1(3f)
                        .orientationDeg(90f)
                        .floor(floorForum)
                        .build()
            );
            Room stairsForum2 = roomRepo.save(
                    Room.builder()
                        .roomType(stairs)
                        .roomName("Escalier 2 Forum")
                        .coordX1(5f).coordZ1(3f)
                        .orientationDeg(90f)
                        .floor(floorForum)
                        .build()
            );
            Room stairsForum3 = roomRepo.save(
                    Room.builder()
                        .roomType(stairs)
                        .roomName("Escalier 3 Forum")
                        .coordX1(-20f).coordZ1(3f)
                        .orientationDeg(90f)
                        .floor(floorForum)
                        .build()
            );

            Room roomA101 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A101")
                        .coordX1(-25f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .floor(floor1)
                        .build()
            );

            Room roomA102 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A102")
                        .coordX1(-25f).coordZ1(-13f)
                        .orientationDeg(0f)
                        .floor(floor1)
                        .build()
            );

            Room roomA103 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A103")
                        .coordX1(13f).coordZ1(10f)
                        .orientationDeg(90f)
                        .floor(floor1)
                        .build()
            );

            Room roomA104 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A104")
                        .coordX1(1f).coordZ1(10f)
                        .orientationDeg(90f)
                        .floor(floor1)
                        .build()
            );

            Room roomA105 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A105")
                        .coordX1(19f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .floor(floor1)
                        .build()
            );

            Room roomA106 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A106")
                        .coordX1(13f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .floor(floor1)
                        .build()
            );

            Room roomA107 = roomRepo.save(
                    Room.builder()
                        .roomType(office2Desks)
                        .roomName("A107")
                        .coordX1(7f).coordZ1(-25f)
                        .orientationDeg(90f)
                        .floor(floor1)
                        .build()
            );

            Room roomA108 = roomRepo.save(
                    Room.builder()
                        .roomType(office4Desks)
                        .roomName("A108")
                        .coordX1(0f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .floor(floor1)
                        .build()
            );

            Room roomA109 = roomRepo.save(
                    Room.builder()
                        .roomType(office6Desks)
                        .roomName("A109")
                        .coordX1(-10f).coordZ1(-10f)
                        .orientationDeg(180f)
                        .floor(floor1)
                        .build()
            );

            Room openspace_1 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_001")
                        .coordX1(-22f).coordZ1(18f)
                        .orientationDeg(0f)
                        .openspaceNumber(7)
                        .floor(floor1)
                        .build()
            );

            Room openspace_2 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_002")
                        .coordX1(-22f).coordZ1(10f)
                        .orientationDeg(0f)
                        .openspaceNumber(7)
                        .floor(floor1)
                        .build()
            );

            Room openspace_3 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_003")
                        .coordX1(-22f).coordZ1(2f)
                        .orientationDeg(0f)
                        .openspaceNumber(5)
                        .floor(floor1)
                        .build()
            );

            Room openspace_4 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_004")
                        .coordX1(16f).coordZ1(6f)
                        .orientationDeg(90f)
                        .openspaceNumber(10)
                        .floor(floor1)
                        .build()
            );

            Room openspace_5 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_005")
                        .coordX1(4f).coordZ1(6f)
                        .orientationDeg(90f)
                        .openspaceNumber(10)
                        .floor(floor1)
                        .build()
            );

            Room stairsA100 = roomRepo.save(
                    Room.builder()
                        .roomType(stairs)
                        .roomName("Escalier A100")
                        .coordX1(22f).coordZ1(0f)
                        .orientationDeg(90f)
                        .floor(floor1)
                        .nextFloor(floor2)
                        .position("up")
                        .build()
            );


            Room roomA201 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A201")
                        .coordX1(-30f).coordZ1(-12f)
                        .orientationDeg(0f)
                        .floor(floor2)
                        .build()
            );

            Room roomA202 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A202")
                        .coordX1(-30f).coordZ1(0f)
                        .orientationDeg(0f)
                        .floor(floor2)
                        .build()
            );

            Room roomA203 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A203")
                        .coordX1(15f).coordZ1(-12f)
                        .orientationDeg(180f)
                        .floor(floor2)
                        .build()
            );

            Room roomA204 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A204")
                        .coordX1(15f).coordZ1(0f)
                        .orientationDeg(180f)
                        .floor(floor2)
                        .build()
            );

            Room roomA205 = roomRepo.save(
                    Room.builder()
                        .roomType(office2Desks)
                        .roomName("A205")
                        .coordX1(-9f).coordZ1(-12f)
                        .orientationDeg(90f)
                        .floor(floor2)
                        .build()
            );

            Room roomA206 = roomRepo.save(
                    Room.builder()
                        .roomType(office2Desks)
                        .roomName("A206")
                        .coordX1(-3f).coordZ1(-12f)
                        .orientationDeg(90f)
                        .floor(floor2)
                        .build()
            );

            Room roomA207 = roomRepo.save(
                    Room.builder()
                        .roomType(office2Desks)
                        .roomName("A207")
                        .coordX1(3f).coordZ1(-12f)
                        .orientationDeg(90f)
                        .floor(floor2)
                        .build()
            );

            Room roomA208 = roomRepo.save(
                    Room.builder()
                        .roomType(office2Desks)
                        .roomName("A208")
                        .coordX1(9f).coordZ1(-12f)
                        .orientationDeg(90f)
                        .floor(floor2)
                        .build()
            );

            Room roomA209 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A209")
                        .coordX1(-15f).coordZ1(8f)
                        .orientationDeg(180f)
                        .floor(floor2)
                        .build()
            );

            Room roomA210 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A210")
                        .coordX1(-9f).coordZ1(8f)
                        .orientationDeg(180f)
                        .floor(floor2)
                        .build()
            );

            Room roomA211 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A211")
                        .coordX1(-3f).coordZ1(8f)
                        .orientationDeg(180f)
                        .floor(floor2)
                        .build()
            );

            Room roomA212 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A212")
                        .coordX1(3f).coordZ1(8f)
                        .orientationDeg(180f)
                        .floor(floor2)
                        .build()
            );

            Room stairsA200 = roomRepo.save(
                    Room.builder()
                        .roomType(stairs)
                        .roomName("Escalier A200")
                        .coordX1(-12f).coordZ1(-7f)
                        .orientationDeg(-90f)
                        .floor(floor2)
                        .nextFloor(floor1)
                        .position("down")
                        .build()
            );

            // --- DESKS ---

            /*Desk deskStand1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk Stand1")
                        .room(standForumA)
                        .deskType(desk1StandForum)
                        .build()
            );
            Desk deskStand2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk Stand2")
                        .room(standForumA)
                        .deskType(desk2StandForum)
                        .build()
            );  */  

            Desk deskA105 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A105")
                        .room(roomA105)
                        .deskType(desk1office1desk)
                        .build()
            );

            Desk deskA106 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A106")
                        .room(roomA106)
                        .deskType(desk1office1desk)
                        .build()
            );

            Desk deskA107_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A107 1")
                        .room(roomA107)
                        .deskType(desk1office2desks)
                        .build()
            );

            Desk deskA107_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A107 2")
                        .room(roomA107)
                        .deskType(desk2office2desks)
                        .build()
            );

            Desk deskA108_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108 1")
                        .room(roomA108)
                        .deskType(desk1office4desks)
                        .build()
            );

            Desk deskA108_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108 2")
                        .room(roomA108)
                        .deskType(desk2office4desks)
                        .build()
            );

            Desk deskA108_3 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108 3")
                        .room(roomA108)
                        .deskType(desk3office4desks)
                        .build()
            );

            Desk deskA108_4 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108 4")
                        .room(roomA108)
                        .deskType(desk4office4desks)
                        .build()
            );

            Desk deskA109_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 1")
                        .room(roomA109)
                        .deskType(desk1office6desks)
                        .build()
            );

            Desk deskA109_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 2")
                        .room(roomA109)
                        .deskType(desk2office6desks)
                        .build()
            );

            Desk deskA109_3 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 3")
                        .room(roomA109)
                        .deskType(desk3office6desks)
                        .build()
            );

            Desk deskA109_4 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 4")
                        .room(roomA109)
                        .deskType(desk4office6desks)
                        .build()
            );

            Desk deskA109_5 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 5")
                        .room(roomA109)
                        .deskType(desk5office6desks)
                        .build()
            );

            Desk deskA109_6 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 6")
                        .room(roomA109)
                        .deskType(desk6office6desks)
                        .build()
            );

            Desk deskA205_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A205 1")
                        .room(roomA205)
                        .deskType(desk1office2desks)
                        .build()
            );

            Desk deskA205_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A205 2")
                        .room(roomA205)
                        .deskType(desk2office2desks)
                        .build()
            );

            Desk deskA206_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A206 1")
                        .room(roomA206)
                        .deskType(desk1office2desks)
                        .build()
            );

            Desk deskA206_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A206 2")
                        .room(roomA206)
                        .deskType(desk2office2desks)
                        .build()
            );

            Desk deskA207_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A207 1")
                        .room(roomA207)
                        .deskType(desk1office2desks)
                        .build()
            );

            Desk deskA207_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A207 2")
                        .room(roomA207)
                        .deskType(desk2office2desks)
                        .build()
            );

            Desk deskA208_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A208 1")
                        .room(roomA208)
                        .deskType(desk1office2desks)
                        .build()
            );

            Desk deskA208_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A208 2")
                        .room(roomA208)
                        .deskType(desk2office2desks)
                        .build()
            );

            Desk deskA209 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A209")
                        .room(roomA209)
                        .deskType(desk1office1desk)
                        .build()
            );

            Desk deskA210 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A210")
                        .room(roomA210)
                        .deskType(desk1office1desk)
                        .build()
            );

            Desk deskA211 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A211")
                        .room(roomA211)
                        .deskType(desk1office1desk)
                        .build()
            );

            Desk deskA212 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A212")
                        .room(roomA212)
                        .deskType(desk1office1desk)
                        .build()
            );

            // --- EMPLOYEES ---
            Employee alice = createEmployeeWithAccount(
                    "Alice",
                    "Dupont",
                    deskA105,
                    "alice.dupont@keliocity.com",
                    "0601020304",
                    "09:00-17:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.WOMAN1
            );

            /*Employee bob = createEmployeeWithAccount(
                    "Bob",
                    "Martin",
                    deskA106,
                    "bob.martin@keliocity.com",
                    "0611223344",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.OCCUPIED,
                    Sprite.MAN1
            );*/

            /*Employee jade = createEmployeeWithAccount(
                    "Jade",
                    "Bernard",
                    deskA107_1,
                    "jade.bernard@keliocity.com",
                    "0611020777",
                    "09:00-17:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.WOMAN2
            );*/

            Employee pol = createEmployeeWithAccount(
                    "Pol",
                    "Meuler",
                    deskA107_2,
                    "pol.meuler@keliocity.com",
                    "0611721777",
                    "09:00-17:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.MAN2
            );

            /*Employee paul = createEmployeeWithAccount(
                    "Paul",
                    "Lefevre",
                    deskA108_1,
                    "paul.lefevre@keliocity.com",
                    "0681283384",
                    "08:00-16:00",
                    WorkLocation.REMOTE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.MAN2
            );*/

            Employee jacob = createEmployeeWithAccount(
                    "Jacob",
                    "Clair",
                    deskA108_2,
                    "jacob.clair@keliocity.com",
                    "0681243384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.ABSENT,
                    Sprite.MAN1
            );

            Employee alicia = createEmployeeWithAccount(
                    "Alicia",
                    "Rodriguez",
                    deskA108_3,
                    "alicia.rodriguez@keliocity.com",
                    "0681283389",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.OCCUPIED,
                    Sprite.WOMAN2
            );

            /*Employee marguerite = createEmployeeWithAccount(
                    "Marguerite",
                    "Diatre",
                    deskA108_4,
                    "marguerite.diatre@keliocity.com",
                    "0681203384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.OCCUPIED,
                    Sprite.WOMAN1
            );*/

            Employee alexis = createEmployeeWithAccount(
                    "Alexis",
                    "Dialo",
                    deskA109_1,
                    "alexis.dialo@keliocity.com",
                    "0781203384",
                    "08:00-16:00",
                    WorkLocation.REMOTE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.MAN3
            );

            /*Employee jeanne = createEmployeeWithAccount(
                    "Jeanne",
                    "Dargen",
                    deskA109_2,
                    "jeanne.dargen@keliocity.com",
                    "0681201384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.WOMAN3
            );*/

            /*Employee matthieu = createEmployeeWithAccount(
                    "Matthieu",
                    "Bess",
                    deskA109_3,
                    "matthieu.bess@keliocity.com",
                    "0681803384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.MAN4
            );*/

            Employee jacques = createEmployeeWithAccount(
                    "Jacques",
                    "Marlot",
                    deskA109_4,
                    "jacques.marlot@keliocity.com",
                    "0681243384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.ABSENT,
                    Sprite.MAN2
            );

            Employee alphonsine = createEmployeeWithAccount(
                    "Alphonsine",
                    "Sauvignon",
                    deskA109_5,
                    "alphonsine.sauvignon@keliocity.com",
                    "0631203384",
                    "08:00-16:00",
                    WorkLocation.REMOTE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.WOMAN1
            );

            Employee hector = createEmployeeWithAccount(
                    "Hector",
                    "De Thouars",
                    deskA109_6,
                    "hector.dethouars@keliocity.com",
                    "0681000384",
                    "08:00-16:00",
                    WorkLocation.REMOTE,
                    EmployeeStatus.OCCUPIED,
                    Sprite.MAN1
            );

            Employee jackson = createEmployeeWithAccount(
                    "Jackson",
                    "Smith",
                    deskA205_1,
                    "jackson.smith@keliocity.com",
                    "0681001384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.MAN1
            );

            Employee bruce = createEmployeeWithAccount(
                    "Bruce",
                    "Lice",
                    deskA205_2,
                    "bruce.lice@keliocity.com",
                    "0681501384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.OCCUPIED,
                    Sprite.MAN2
            );

            /*Employee jackie = createEmployeeWithAccount(
                    "Jackie",
                    "Champs",
                    deskA206_1,
                    "jackie.champs@keliocity.com",
                    "0641501384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.WOMAN2
            );*/

            /*Employee martha = createEmployeeWithAccount(
                    "Martha",
                    "Saoss",
                    deskA206_2,
                    "martha.saoss@keliocity.com",
                    "0681501784",
                    "08:00-16:00",
                    WorkLocation.REMOTE,
                    EmployeeStatus.OCCUPIED,
                    Sprite.WOMAN4
            );*/

            Employee ali = createEmployeeWithAccount(
                    "Ali",
                    "gateur",
                    deskA207_1,
                    "ai.gateur@keliocity.com",
                    "0781501384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.MAN4
            );

            /*Employee nathalie = createEmployeeWithAccount(
                    "Nathalie",
                    "Havre",
                    deskA207_2,
                    "nathalie.havre@keliocity.com",
                    "0611501384",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.WOMAN1
            );*/

            /*Employee james = createEmployeeWithAccount(
                    "James",
                    "Bord",
                    deskA208_1,
                    "james.bord@keliocity.com",
                    "0681501386",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.OCCUPIED,
                    Sprite.MAN2
            );*/

            Employee mel = createEmployeeWithAccount(
                    "Mel",
                    "heire",
                    deskA208_2,
                    "mel.heir@keliocity.com",
                    "0681501380",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.WOMAN3
            );

            /*Employee antoine = createEmployeeWithAccount(
                    "Antoine",
                    "Rase",
                    deskA209,
                    "antoine.rase@keliocity.com",
                    "0611293344",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.MAN1
            );

            Employee rose = createEmployeeWithAccount(
                    "Rose",
                    "Bornart",
                    deskA210,
                    "rose.bornart@keliocity.com",
                    "0671293344",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.WOMAN1
            );

            /*Employee pierre = createEmployeeWithAccount(
                    "Pierre",
                    "Raux",
                    deskA211,
                    "pierre.raux@keliocity.com",
                    "0611293364",
                    "08:00-16:00",
                    WorkLocation.REMOTE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.MAN2
            );*/

            Employee moly = createEmployeeWithAccount(
                    "Moly",
                    "golie",
                    deskA212,
                    "moly.golie@keliocity.com",
                    "0611793344",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.OCCUPIED,
                    Sprite.WOMAN1
            );

            // Employees and desks for openspaces
            List<Person> people = List.of(
                new Person("Mounier", "Astride", "F"),
                new Person("Palvadeau", "Pierre", "H"),
                new Person("Leblanc", "Juste", "H"),
                new Person("Mony", "Jacques", "H"),
                new Person("Brochand", "Pierre", "H"),
                new Person("Pajot", "Annabelle", "F"),
                new Person("Pignon", "François", "H"),
                new Person("Séjourné", "Marguerite", "F"),
                new Person("Chauvet", "Inès", "F"),
                new Person("Héraudeau", "Flore", "F"),
                new Person("Cheval", "Lucien", "H"),
                new Person("Tardy", "Jeanne", "F"),
                new Person("Aunis", "Jules", "H"),
                new Person("Barbotin", "Agathe", "F"),
                new Person("Marzin", "Augustin", "H"),
                new Person("Aujard", "Charlotte", "F"),
                new Person("Marteau", "Baptiste", "H"),
                new Person("Thomas", "Léa", "F"),
                new Person("Petit", "Constant", "H"),
                new Person("Robert", "Anaïs", "F"),
                new Person("Duval", "Léo", "H"),
                new Person("Olivier", "Sarah", "F"),
                new Person("Verdon", "Victor", "H"),
                new Person("Gau", "Chloé", "F"),
                new Person("Boeuf", "Hugo", "H"),
                new Person("Richard", "Elise", "F"),
                new Person("Durand", "Jean", "H"),
                new Person("Dubois", "Garance", "F"),
                new Person("Moreau", "Benjamin", "H"),
                new Person("Leroy", "Justine", "F"),
                new Person("Roux", "Léo", "H"),
                new Person("David", "Alia", "F"),
                new Person("Davy", "Lilian", "H"),
                new Person("Pernault", "Julie", "F"),
                new Person("Frigière", "Félix", "H"),
                new Person("Libourel", "Joséphine", "F"),
                new Person("Bertrand", "Jacob", "H"),
                new Person("Chatonnet", "Ernestine", "F"),
                new Person("Rault", "Louis", "H"),
                new Person("Garnier", "Sophie", "F"),
                new Person("Blanc", "Marc", "H"),
                new Person("Leclerc", "Cécile", "F"),
                new Person("Marchand", "Antoine", "H"),
                new Person("Perrot", "Camille", "F"),
                new Person("Giraud", "Nicolas", "H"),
                new Person("Renaud", "Amandine", "F"),
                new Person("Barre", "Mathieu", "H"),
                new Person("Caron", "Manon", "F"),
                new Person("Plaisant", "Thomas", "H"),
                new Person("Lemoine", "Clara", "F"),
                new Person("Rivet", "Olivier", "H"),
                new Person("Gautier", "Laura", "F"),
                new Person("Foucher", "Grégoire", "H"),
                new Person("Collet", "Élodie", "F"),
                new Person("Remy", "Sébastien", "H"),
                new Person("Brun", "Noémie", "F"),
                new Person("Guillaume", "Alexandre", "H"),
                new Person("Bazin", "Marine", "F"),
                new Person("Lefort", "Vincent", "H"),
                new Person("Maurin", "Aline", "F"),
                new Person("Poulain", "Romain", "H"),
                new Person("Guillet", "Laure", "F"),
                new Person("Vidal", "Cédric", "H"),
                new Person("Hardy", "Solène", "F"),
                new Person("Oger", "Adrien", "H"),
                new Person("Couturier", "Isabelle", "F"),
                new Person("Legrand", "Fabien", "H"),
                new Person("Rousseau", "Amélie", "F"),
                new Person("Monnier", "Samuel", "H"),
                new Person("Hubert", "Delphine", "F"),
                new Person("Noël", "Maxime", "H"),
                new Person("Bastien", "Emilie", "F"),
                new Person("Guyon", "Laurent", "H"),
                new Person("Poitou", "Aurélie", "F"),
                new Person("Camus", "Niels", "H"),
                new Person("Caillaud", "Georges", "H")
            );

            Room[] openspaces = {openspace_1, openspace_2, openspace_3, openspace_4, openspace_5};

            DeskType[][] deskType_openspaces = new DeskType[2][10];
            for (int i=0; i<10; i++) {
                 deskType_openspaces[0][i] = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(2.2f + 2.52f * i)
                            .coordZ(0.4f)
                            .orientationDeg(0f)
                            .roomType(openspace)
                            .deskNumber(2*i)
                            .build()
                );
                deskType_openspaces[1][i] = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(1.68f + 2.52f * i)
                            .coordZ(3.1f)
                            .orientationDeg(180f)
                            .roomType(openspace)
                            .deskNumber(2*i+1)
                            .build()
                );
            }
            deskTypeRepo.flush();

            for (int j=0; j<3; j++) {
                for (int i=0; i<7; i++) {
                    if (j != 2 || i < 5) {
                        Desk deskD_openspace = deskRepo.save(
                            Desk.builder()
                                .deskName("Desk OA100_00"+(j+1)+" "+(2*i+1))
                                .room(openspaces[j])
                                .deskType(deskType_openspaces[0][i])
                                .build()
                        );
                        deskRepo.flush();
                        if (shouldCreateEmployeeOnDeskD(i,j)) {
	                        String spriteD;
	                        if (people.get(14*j+2*i).gender.equals("H")) {
	                            spriteD = "MAN"+((i%4)+1);
	                        } else {
	                            spriteD = "WOMAN"+((i%4)+1);
	                        }
	
	                        WorkLocation workLocation;
	                        EmployeeStatus employeeStatus;
	                        if ((i+1)%3 == 0) {
	                            workLocation = WorkLocation.REMOTE;
	                        } else {
	                            workLocation = WorkLocation.OFFICE;
	                        }
	                        if ((i+1)%5 == 0) {
	                            employeeStatus = EmployeeStatus.OCCUPIED;
	                        } else if ((i+1)%7 == 0) {
	                            employeeStatus = EmployeeStatus.ABSENT;
	                        } else {
	                            employeeStatus = EmployeeStatus.AVAILABLE;
	                        }
	                        
	                        createEmployeeWithAccount(
						            people.get(14*j+2*i).firstname,
						            people.get(14*j+2*i).lastname,
						            deskD_openspace,
						            people.get(14*j+2*i).firstname.toLowerCase() + "." + people.get(14*j+2*i).lastname.toLowerCase() + "@keliocity.com",
						            "06" + j + "28399" + i,
						            "08:00-16:00",
						            workLocation,
						            employeeStatus,
						            Sprite.valueOf(spriteD)
						    	);
	                        accountRepo.flush();
                        }
                        Desk deskG_openspace = deskRepo.save(
                            Desk.builder()
                                .deskName("Desk OA100_00"+(j+1)+" "+(2*i+2))
                                .room(openspaces[j])
                                .deskType(deskType_openspaces[1][i])
                                .build()
                        );
                        deskRepo.flush();
                        if (shouldCreateEmployeeOnDeskG(i,j)) {
	                        String spriteG;
	                        if (people.get(14*j+2*i+1).gender.equals("H")) {
	                            spriteG = "MAN"+((i%4)+1);
	                        } else {
	                            spriteG = "WOMAN"+((i%4)+1);
	                        }
	                        
	                        createEmployeeWithAccount(
					            people.get(14*j+2*i+1).firstname,
					            people.get(14*j+2*i+1).lastname,
					            deskG_openspace,
					            people.get(14*j+2*i+1).firstname.toLowerCase() + "." + people.get(14*j+2*i+1).lastname.toLowerCase() + "@keliocity.com",
					            "06" + j + "128999" + i,
					            "08:00-16:00",
					            WorkLocation.OFFICE,
					            EmployeeStatus.AVAILABLE,
					            Sprite.valueOf(spriteG)
					    	);
		                         
	                        
	                        accountRepo.flush();
                        }
                    }
                }
            }

            for (int j=0; j<2; j++) {
                for (int i=0; i<10; i++) {
                    Desk deskD_openspace = deskRepo.save(
                        Desk.builder()
                            .deskName("Desk OA100_00"+(j+4)+" "+(2*i+1))
                            .room(openspaces[j+3])
                            .deskType(deskType_openspaces[0][i])
                            .build()
                    );
                    deskRepo.flush();
                    if (i != 9) {
                    	if (shouldCreateEmployeeOnDeskD(i,j)) {
	                        String spriteD;
	                        if (people.get(20*j+2*i+38).gender.equals("H")) {
	                            spriteD = "MAN"+((i%4)+1);
	                        } else {
	                            spriteD = "WOMAN"+((i%4)+1);
	                        }
	
	                        WorkLocation workLocation;
	                        EmployeeStatus employeeStatus;
	                        if ((i+1)%5 == 0) {
	                            workLocation = WorkLocation.REMOTE;
	                        } else {
	                            workLocation = WorkLocation.OFFICE;
	                        }
	                        if ((i+1)%7 == 0) {
	                            employeeStatus = EmployeeStatus.OCCUPIED;
	                        } else if (i == 2) {
	                            employeeStatus = EmployeeStatus.ABSENT;
	                        } else {
	                            employeeStatus = EmployeeStatus.AVAILABLE;
	                        }
	                        
	                        createEmployeeWithAccount(
						            people.get(20*j+2*i+38).firstname,
						            people.get(20*j+2*i+38).lastname,
						            deskD_openspace,
						            people.get(20*j+2*i+38).firstname.toLowerCase() + "." + people.get(20*j+2*i+38).lastname.toLowerCase() + "@keliocity.com",
						            "06" + j + "28399" + i,
						            "08:00-16:00",
						            workLocation,
						            employeeStatus,
						            Sprite.valueOf(spriteD)
					    		);
                    	}
                    }
                    accountRepo.flush();
                    Desk deskG_openspace = deskRepo.save(
                        Desk.builder()
                            .deskName("Desk OA100_00"+(j+4)+" "+(2*i+2))
                            .room(openspaces[j+3])
                            .deskType(deskType_openspaces[1][i])
                            .build()
                    );
                    deskRepo.flush();
                    if (i != 9) {
                    	if (shouldCreateEmployeeOnDeskG(i,j)) {
	                        String spriteG;
	                        if (people.get(20*j+2*i+39).gender.equals("H")) {
	                            spriteG = "MAN"+((i%4)+1);
	                        } else {
	                            spriteG = "WOMAN"+((i%4)+1);
	                        }
	                        
	                        createEmployeeWithAccount(
					            people.get(20*j+2*i+39).firstname,
					            people.get(20*j+2*i+39).lastname,
					            deskG_openspace,
					            people.get(20*j+2*i+39).firstname.toLowerCase() + "." + people.get(20*j+2*i+39).lastname.toLowerCase() + "@keliocity.com",
					            "06" + j + "738999" + i,
					            "08:00-16:00",
					            WorkLocation.OFFICE,
					            EmployeeStatus.AVAILABLE,
					            Sprite.valueOf(spriteG)
				    		);
	                         
	                        accountRepo.flush();
                    	}
                    }
                }
            }

            LocalDateTime today = LocalDateTime.now()
                    .withHour(0).withMinute(0).withSecond(0).withNano(0);

            LocalDateTime tomorrow = today.plusDays(1);

            List<Employee> employees = employeeRepo.findAll();
            List<Room> meetingRooms = roomRepo.findAll().stream()
                    .filter(r -> r.getRoomType().getRoomtypeName().equals("MeetingRoom"))
                    .toList();

            // --- 1 réunion par salle aujourd'hui ---
            java.util.Map<Room, Meeting> todayMeetingsByRoom = new java.util.HashMap<>();

            for (int i = 0; i < meetingRooms.size(); i++) {
                Room room = meetingRooms.get(i);

                // horaires différents selon la salle
                LocalDateTime start = today.withHour(9 + i).withMinute(0);
                LocalDateTime end = start.plusHours(1);

                Meeting m = meetingRepo.save(
                        Meeting.builder()
                                .room(room)
                                .title("Réunion quotidienne - " + room.getRoomName())
                                .startingHour(start)
                                .endHour(end)
                                .description("Réunion planifiée (1 par salle / jour)")
                                .build()
                );
                meetingRepo.flush();
                todayMeetingsByRoom.put(room, m);
            }

            // --- 1 réunion par salle demain ---
            java.util.Map<Room, Meeting> tomorrowMeetingsByRoom = new java.util.HashMap<>();

            for (int i = 0; i < meetingRooms.size(); i++) {
                Room room = meetingRooms.get(i);

                LocalDateTime start = tomorrow.withHour(10 + i).withMinute(0);
                LocalDateTime end = start.plusMinutes(45);

                Meeting m = meetingRepo.save(
                        Meeting.builder()
                                .room(room)
                                .title("Point équipe - " + room.getRoomName())
                                .startingHour(start)
                                .endHour(end)
                                .description("Réunion planifiée (1 par salle / jour)")
                                .build()
                );
                meetingRepo.flush();
                tomorrowMeetingsByRoom.put(room, m);
            }

            // --- Répartition des employés comme participants (round-robin) ---
            // Chaque employé participe à 1 meeting aujourd'hui + 1 meeting demain,
            // sans créer de meetings supplémentaires (donc pas de conflit salle/jour).
            for (int idx = 0; idx < employees.size(); idx++) {
                Employee employee = employees.get(idx);

                Room roomToday = meetingRooms.get(idx % meetingRooms.size());
                Meeting meetingToday = todayMeetingsByRoom.get(roomToday);

                meetingEmployeeRepo.save(
                        new MeetingEmployee(
                                meetingToday,
                                employee,
                                true,
                                employee.getInOffice() == WorkLocation.REMOTE
                        )
                );

                Room roomTomorrow = meetingRooms.get((idx + 1) % meetingRooms.size());
                Meeting meetingTomorrow = tomorrowMeetingsByRoom.get(roomTomorrow);

                meetingEmployeeRepo.save(
                        new MeetingEmployee(
                                meetingTomorrow,
                                employee,
                                true,
                                employee.getInOffice() == WorkLocation.REMOTE
                        )
                );
            }
            meetingEmployeeRepo.flush();

            System.out.println("✔ Base de données initialisée !");
        }
    }
    public static record Person(String lastname, String firstname, String gender) {}
}
