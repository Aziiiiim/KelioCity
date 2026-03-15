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
    
    
    private Room createRoom(RoomType roomType, String roomName, float x, float z, float orientation, Floor floor) {
        return roomRepo.save(
            Room.builder()
                .roomType(roomType)
                .roomName(roomName)
                .coordX1(x) //52
                .coordZ1(z) // 22
                .orientationDeg(orientation)
                .floor(floor)
                .build()
        );
    }
    
    private Room createStairsRoom(RoomType roomType, String roomName, float x, float z, float orientation,
            Floor floor, Floor nextFloor, String position) {
		return roomRepo.save(
			Room.builder()
				.roomType(roomType)
				.roomName(roomName)
				.coordX1(x)
				.coordZ1(z)
				.orientationDeg(orientation)
				.floor(floor)
				.nextFloor(nextFloor)
				.position(position)
				.build()
		);
	}
    
    private Desk createDesk(Room room, DeskType deskType, String deskName) {
        return deskRepo.save(
            Desk.builder()
                .deskName(deskName)
                .room(room)
                .deskType(deskType)
                .build()
        );
    }
    
    private String normalizeForEmail(String value) {
        String normalized = java.text.Normalizer.normalize(value, java.text.Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "");

        normalized = normalized
            .toLowerCase()
            .replace("’", "-")
            .replace("'", "-")
            .replaceAll("[^a-z0-9-]+", "-")
            .replaceAll("^-+", "")
            .replaceAll("-+$", "")
            .replaceAll("-{2,}", "-");

        return normalized;
    }

    private String buildImtEmail(String firstName, String lastName) {
        return normalizeForEmail(firstName) + "." + normalizeForEmail(lastName) + "@imt-atlantique.fr";
    }
    
    @Override
    @Transactional
    public void run(String... args) {

        if (roomRepo.count() == 0) {
            System.out.println("➡️ Initialisation de la base de données…");

            // --- FLOOR ---
            /*Floor floor1 = floorRepo.save(
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
            );*/
            
            Floor floor3 = floorRepo.save(
            		Floor.builder()
            		.floorName("Amphis")
                    .lengthX(220f)
                    .lengthZ(15f)
                    .build()
            );
            
            Floor floor4 = floorRepo.save(
            		Floor.builder()
            		.floorName("Etage B2")
                    .lengthX(17f)
                    .lengthZ(110f)
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
            
            RoomType SmallAmphi = roomTypeRepo.save(
            		RoomType.builder()
            			.roomtypeName("SmallAmphi")
            			.lengthX(30f)
            			.lengthZ(30f)
            			.build()
            );
            
            RoomType BigAmphi = roomTypeRepo.save(
            		RoomType.builder()
            			.roomtypeName("BigAmphi")
            			.lengthX(30f)
            			.lengthZ(30f)
            			.build()
            );
            
            
            
            RoomType office1DeskB2 = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office1DeskB2")
                        .lengthX(6f)
                        .lengthZ(3.5f)
                        .build()
            );

            RoomType office2DesksB2 = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office2DesksB2")
                        .lengthX(6f)
                        .lengthZ(4.5f)
                        .build()
            );

            RoomType office3DesksB2 = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office3DesksB2")
                        .lengthX(6f)
                        .lengthZ(5.5f)
                        .build()
            );

            RoomType office4DesksB2 = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office4DesksB2")
                        .lengthX(6f)
                        .lengthZ(6.5f)
                        .build()
            );

            RoomType office5DesksB2 = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Office5DesksB2")
                        .lengthX(6f)
                        .lengthZ(10.5f)
                        .build()
            );

            RoomType meetingRoomB2 = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("MeetingRoomB2")
                        .lengthX(6f)
                        .lengthZ(6.5f)
                        .build()
            );

            RoomType stairwellB2 = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("StairwellB2")
                        .lengthX(4f)
                        .lengthZ(6f)
                        .build()
            );

            RoomType stairsB2 = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("StairsB2")
                        .lengthX(1.68f)
                        .lengthZ(2.9f)
                        .build()
            );

            RoomType local = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Local")
                        .lengthX(6f)
                        .lengthZ(3.5f)
                        .build()
            );

            RoomType localB2 = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("LocalB2")
                        .lengthX(6f)
                        .lengthZ(8.5f)
                        .build()
            );

            RoomType toilets = roomTypeRepo.save(
                    RoomType.builder()
                        .roomtypeName("Toilets")
                        .lengthX(6f)
                        .lengthZ(3.167f)
                        .build()
            );


            RoomType b2Access = roomTypeRepo.save(
        	    RoomType.builder()
        	        .roomtypeName("B2Access")
        	        .lengthX(8f)
        	        .lengthZ(8f)
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

            DeskType desk1office1deskB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(4.7f)
                        .coordZ(1.4f)
                        .orientationDeg(0f)
                        .roomType(office1DeskB2)
                        .deskNumber(1)
                        .build()
            );

            DeskType desk1office2desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(4.7f)
                        .coordZ(1.4f)
                        .orientationDeg(0f)
                        .roomType(office2DesksB2)
                        .deskNumber(1)
                        .build()
            );

            DeskType desk2office2desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.2f)
                        .coordZ(3.05f)
                        .orientationDeg(180f)
                        .roomType(office2DesksB2)
                        .deskNumber(2)
                        .build()
            );

            DeskType desk1office3desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(4.7f)
                        .coordZ(1.4f)
                        .orientationDeg(0f)
                        .roomType(office3DesksB2)
                        .deskNumber(1)
                        .build()
            );

            DeskType desk2office3desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.2f)
                        .coordZ(3.05f)
                        .orientationDeg(180f)
                        .roomType(office3DesksB2)
                        .deskNumber(2)
                        .build()
            );

            DeskType desk3office3desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(5.1f)
                        .coordZ(3.5f)
                        .orientationDeg(180f)
                        .roomType(office3DesksB2)
                        .deskNumber(3)
                        .build()
            );

            DeskType desk1office4desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(4.7f)
                        .coordZ(1.4f)
                        .orientationDeg(0f)
                        .roomType(office4DesksB2)
                        .deskNumber(1)
                        .build()
            );

            DeskType desk2office4desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.2f)
                        .coordZ(3.05f)
                        .orientationDeg(180f)
                        .roomType(office4DesksB2)
                        .deskNumber(2)
                        .build()
            );

            DeskType desk3office4desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(5.1f)
                        .coordZ(3.5f)
                        .orientationDeg(180f)
                        .roomType(office4DesksB2)
                        .deskNumber(3)
                        .build()
            );

            DeskType desk4office4desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.2f)
                        .coordZ(5.45f)
                        .orientationDeg(0f)
                        .roomType(office4DesksB2)
                        .deskNumber(4)
                        .build()
            );

            DeskType desk1office5desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(4.7f)
                        .coordZ(1.4f)
                        .orientationDeg(0f)
                        .roomType(office5DesksB2)
                        .deskNumber(1)
                        .build()
            );

            DeskType desk2office5desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.2f)
                        .coordZ(3.05f)
                        .orientationDeg(180f)
                        .roomType(office5DesksB2)
                        .deskNumber(2)
                        .build()
            );

            DeskType desk3office5desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(5.1f)
                        .coordZ(3.5f)
                        .orientationDeg(180f)
                        .roomType(office5DesksB2)
                        .deskNumber(3)
                        .build()
            );

            DeskType desk4office5desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.05f)
                        .coordZ(5.8f)
                        .orientationDeg(-90f)
                        .roomType(office5DesksB2)
                        .deskNumber(4)
                        .build()
            );

            DeskType desk5office5desksB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.2f)
                        .coordZ(9.45f)
                        .orientationDeg(0f)
                        .roomType(office5DesksB2)
                        .deskNumber(5)
                        .build()
            );

            DeskType desk1meetingRoomB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.4f)
                        .coordZ(5f)
                        .orientationDeg(90f)
                        .roomType(meetingRoomB2)
                        .deskNumber(1)
                        .build()
            );

            DeskType desk2meetingRoomB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(1.4f)
                        .coordZ(3.5f)
                        .orientationDeg(90f)
                        .roomType(meetingRoomB2)
                        .deskNumber(2)
                        .build()
            );

            DeskType desk3meetingRoomB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(2.2f)
                        .coordZ(1.9f)
                        .orientationDeg(0f)
                        .roomType(meetingRoomB2)
                        .deskNumber(3)
                        .build()
            );

            DeskType desk4meetingRoomB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(3.8f)
                        .coordZ(1.9f)
                        .orientationDeg(0f)
                        .roomType(meetingRoomB2)
                        .deskNumber(4)
                        .build()
            );

            DeskType desk5meetingRoomB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(4.6f)
                        .coordZ(3.5f)
                        .orientationDeg(-90f)
                        .roomType(meetingRoomB2)
                        .deskNumber(5)
                        .build()
            );

            DeskType desk6meetingRoomB2 = deskTypeRepo.save(
                    DeskType.builder()
                        .coordX(4.6f)
                        .coordZ(5f)
                        .orientationDeg(-90f)
                        .roomType(meetingRoomB2)
                        .deskNumber(6)
                        .build()
            );

            // --- ROOMS ---
            /*Room roomA101 = roomRepo.save(
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
            */
            
            // AMPHIS
            
            Room charpak = roomRepo.save(
            		Room.builder()
            			.roomType(BigAmphi)
            			.roomName("Amphi Charpak")
            			.coordX1(-85f).coordZ1(-52f)
            			.orientationDeg(90f)
            			.floor(floor3)
            			.build()
            );
            
            Room kastler = roomRepo.save(
            		Room.builder()
            			.roomType(BigAmphi)
            			.roomName("Amphi Kastler")
            			.coordX1(-40f).coordZ1(-52f)
            			.orientationDeg(90f)
            			.floor(floor3)
            			.build()
            );
            
            Room stairsKastler1 = roomRepo.save(
                    Room.builder()
                        .roomType(stairs)
                        .roomName("Escalier Kastler")
                        .coordX1(-20f).coordZ1(12f)
                        .orientationDeg(-90f)
                        .floor(floor3)
                        .nextFloor(null)
                        .position("down")
                        .build()
            );
            
            Room stairsKastler2 = roomRepo.save(
                    Room.builder()
                        .roomType(stairs)
                        .roomName("Escalier Kastler")
                        .coordX1(-17f).coordZ1(12f)
                        .orientationDeg(-90f)
                        .floor(floor3)
                        .nextFloor(null)
                        .position("down")
                        .build()
            );

            
            Room amphi1 = roomRepo.save(
            		Room.builder()
            			.roomType(SmallAmphi)
            			.roomName("A102")
            			.coordX1(-10f).coordZ1(22f)
            			.orientationDeg(-90f)
            			.floor(floor3)
            			.build()
            );
            
            Room stairsA102 = roomRepo.save(
                    Room.builder()
                        .roomType(stairs)
                        .roomName("Escalier A102")
                        .coordX1(50f).coordZ1(12f)
                        .orientationDeg(-90f)
                        .floor(floor3)
                        .nextFloor(null)
                        .position("down")
                        .build()
            );
            
            Room toiletAmphis1 = roomRepo.save(
            		Room.builder()
            			.roomType(toilets)
            			.roomName("Toilettes amphis")
            			.coordX1(60f).coordZ1(7f)
            			.orientationDeg(-90f)
            			.floor(floor3)
            			.build()
            );
            Room toiletAmphis2 = roomRepo.save(
            		Room.builder()
            			.roomType(toilets)
            			.roomName("Toilettes amphis")
            			.coordX1(63f).coordZ1(7f)
            			.orientationDeg(-90f)
            			.floor(floor3)
            			.build()
            );
            Room toiletAmphis3 = roomRepo.save(
            		Room.builder()
            			.roomType(toilets)
            			.roomName("Toilettes amphis")
            			.coordX1(66f).coordZ1(7f)
            			.orientationDeg(-90f)
            			.floor(floor3)
            			.build()
            );
            
            Room toiletAmphis4 = roomRepo.save(
            		Room.builder()
            			.roomType(toilets)
            			.roomName("Toilettes amphis")
            			.coordX1(69f).coordZ1(7f)
            			.orientationDeg(-90f)
            			.floor(floor3)
            			.build()
            );
            
            
            Room amphi2 = roomRepo.save(
            		Room.builder()
            			.roomType(SmallAmphi)
            			.roomName("A103")
            			.coordX1(70f).coordZ1(22f)
            			.orientationDeg(-90f)
            			.floor(floor3)
            			.build()
            );
            
            Room accessB2 = roomRepo.save(
        	    Room.builder()
        	        .roomType(b2Access)
        	        .roomName("Accès étage B2")
        	        .coordX1(52f)
        	        .coordZ1(-15f)
        	        .orientationDeg(0f)
        	        .floor(floor3)
        	        .nextFloor(floor4)
        	        .position("portal")
        	        .build()
        	);
            
            
         

        Room b205 = createRoom(local, "B205", 2.5f, -51f, 0f, floor4);

        Room b206 = createRoom(office3DesksB2, "B206", -8.5f, -55f, 180f, floor4);
        Room b206b = createRoom(office1DeskB2, "B206b", -8.5f, -49.5f, 180f, floor4);
        Room b207 = createRoom(office1DeskB2, "B207", 2.5f, -47.5f, 0f, floor4);
        Room b208 = createRoom(office1DeskB2, "B208", -8.5f, -46f, 180f, floor4);
        Room b209 = createRoom(office1DeskB2, "B209", 2.5f, -44f, 0f, floor4);
        Room b210 = createRoom(office3DesksB2, "B210", -8.5f, -42.5f, 180f, floor4);
        Room b211 = createRoom(office1DeskB2, "B211", 2.5f, -40.5f, 0f, floor4);
        Room b211b = createRoom(office1DeskB2, "B211b", 2.5f, -37f, 0f, floor4);
        Room b212a = createRoom(meetingRoomB2, "B212a", -8.5f, -37f, 180f, floor4);
        Room b212b = createRoom(office1DeskB2, "B212b", -8.5f, -30.5f, 180f, floor4);
        Room b213 = createRoom(office1DeskB2, "B213", 2.5f, -33.5f, 0f, floor4);
        Room b214 = createRoom(office1DeskB2, "B214", -8.5f, -27f, 180f, floor4);
        Room b215 = createRoom(office2DesksB2, "B215", 2.5f, -30f, 0f, floor4);
        Room b216 = createRoom(office4DesksB2, "B216", -8.5f, -23.5f, 180f, floor4);
        Room b217 = createRoom(office2DesksB2, "B217", 2.5f, -25.5f, 0f, floor4);
        Room b218 = createRoom(meetingRoomB2, "B218", -8.5f, -17f, 180f, floor4);
        Room b218b = createRoom(office2DesksB2, "B218b", -8.5f, -10.5f, 180f, floor4);
        Room b219 = createRoom(office1DeskB2, "B219", 2.5f, -21f, 0f, floor4);
        Room b220 = createRoom(office2DesksB2, "B220", -8.5f, -6f, 180f, floor4);
        Room b221 = createRoom(office3DesksB2, "B221", 2.5f, -17.5f, 0f, floor4);
        Room b222 = createRoom(office1DeskB2, "B222", -8.5f, -1.5f, 180f, floor4);
        Room b223 = createRoom(office1DeskB2, "B223", 2.5f, -12f, 0f, floor4);
        Room b224 = createRoom(office2DesksB2, "B224", -8.5f, 2f, 180f, floor4);
        Room b225 = createRoom(office1DeskB2, "B225", 2.5f, -8.5f, 0f, floor4);
        Room b226 = createRoom(office2DesksB2, "B226", -8.5f, 6.5f, 180f, floor4);
        Room b227 = createRoom(office1DeskB2, "B227", 2.5f, -5f, 0f, floor4);
        Room b228 = createRoom(localB2, "B228", -8.5f, 11f, 180f, floor4);
        Room b229 = createRoom(office2DesksB2, "B229", 2.5f, -1.5f, 0f, floor4);
        Room b231 = createRoom(office3DesksB2, "B231", 2.5f, 3f, 0f, floor4);
        Room b232 = createRoom(localB2, "B232", -8.5f, 19.5f, 180f, floor4);
        Room b233 = createRoom(office1DeskB2, "B233", 2.5f, 8.5f, 0f, floor4);
        Room b234 = createRoom(localB2, "B234", -8.5f, 28f, 180f, floor4);

        Room b235a = createRoom(toilets, "B235a", 2.5f, 12f, 0f, floor4);
        Room b235b = createRoom(toilets, "B235b", 2.5f, 15.167f, 0f, floor4);
        Room b235c = createRoom(toilets, "B235c", 2.5f, 18.334f, 0f, floor4);

        Room b236 = createRoom(office1DeskB2, "B236", -8.5f, 36.5f, 180f, floor4);
        Room b238 = createRoom(office1DeskB2, "B238", -8.5f, 40f, 180f, floor4);
        Room b239 = createRoom(office3DesksB2, "B239", 2.5f, 27.5f, 0f, floor4);
        Room b240 = createRoom(office2DesksB2, "B240", -8.5f, 43.5f, 180f, floor4);
        Room b241 = createRoom(office3DesksB2, "B241", 2.5f, 33f, 0f, floor4);
        Room b242 = createRoom(office1DeskB2, "B242", -8.5f, 48f, 180f, floor4);
        Room b243 = createRoom(office5DesksB2, "B243", 2.5f, 38.5f, 0f, floor4);
        Room b244 = createRoom(office1DeskB2, "B244", -8.5f, 51.5f, 180f, floor4);

        Room cageEsc10 = createRoom(stairwellB2, "Cage Escalier 10 – B2", 2.5f, -55f, -90f, floor4);
        Room esc10Up = createStairsRoom(stairsB2, "Escalier 10 – B2 montée", 2.51f, -55f, 90f, floor4, null, "up");
        Room esc10Down = createStairsRoom(stairsB2, "Escalier 10 – B2 descente", 2.6f, -52.68f, -90f, floor4, null, "down");

        Room cageEsc11 = createRoom(stairwellB2, "Cage Escalier 11 – B2", 4.5f, 21.5f, 0f, floor4);
        Room esc11Up = createStairsRoom(stairsB2, "Escalier 11 – B2 montée", 4.5f, 24.57f, 180f, floor4, null, "up");
        Room esc11Down = createStairsRoom(stairsB2, "Escalier 11 – B2 descente", 6.82f, 24.35f, 0f, floor4, null, "down");

        Room cageEsc12 = createRoom(stairwellB2, "Cage Escalier 12 – B2", 4.5f, 49f, 0f, floor4);
        Room esc12Up = createStairsRoom(stairsB2, "Escalier 12 – B2 montée", 4.5f, 52.07f, 180f, floor4, null, "up");
        Room esc12Down = createStairsRoom(stairsB2, "Escalier 12 – B2 descente", 6.82f, 51.85f, 0f, floor4, null, "down");
        // --- DESKS COULOIR B2 ---
	
	        Desk deskB206_1 = createDesk(b206, desk1office3desksB2, "Desk B206 1");
	        Desk deskB206_2 = createDesk(b206, desk2office3desksB2, "Desk B206 2");
	        Desk deskB206_3 = createDesk(b206, desk3office3desksB2, "Desk B206 3");
	
	        Desk deskB206b_1 = createDesk(b206b, desk1office1deskB2, "Desk B206b 1");
	        Desk deskB207_1 = createDesk(b207, desk1office1deskB2, "Desk B207 1");
	        Desk deskB208_1 = createDesk(b208, desk1office1deskB2, "Desk B208 1");
	        Desk deskB209_1 = createDesk(b209, desk1office1deskB2, "Desk B209 1");
	
	        Desk deskB210_1 = createDesk(b210, desk1office3desksB2, "Desk B210 1");
	        Desk deskB210_2 = createDesk(b210, desk2office3desksB2, "Desk B210 2");
	        Desk deskB210_3 = createDesk(b210, desk3office3desksB2, "Desk B210 3");
	
	        Desk deskB211_1 = createDesk(b211, desk1office1deskB2, "Desk B211 1");
	        Desk deskB211b_1 = createDesk(b211b, desk1office1deskB2, "Desk B211b 1");
	
	        Desk deskB212a_1 = createDesk(b212a, desk1meetingRoomB2, "Desk B212a 1");
	        Desk deskB212a_2 = createDesk(b212a, desk2meetingRoomB2, "Desk B212a 2");
	        Desk deskB212a_3 = createDesk(b212a, desk3meetingRoomB2, "Desk B212a 3");
	        Desk deskB212a_4 = createDesk(b212a, desk4meetingRoomB2, "Desk B212a 4");
	        Desk deskB212a_5 = createDesk(b212a, desk5meetingRoomB2, "Desk B212a 5");
	        Desk deskB212a_6 = createDesk(b212a, desk6meetingRoomB2, "Desk B212a 6");
	
	        Desk deskB212b_1 = createDesk(b212b, desk1office1deskB2, "Desk B212b 1");
	        Desk deskB213_1 = createDesk(b213, desk1office1deskB2, "Desk B213 1");
	        Desk deskB214_1 = createDesk(b214, desk1office1deskB2, "Desk B214 1");
	
	        Desk deskB215_1 = createDesk(b215, desk1office2desksB2, "Desk B215 1");
	        Desk deskB215_2 = createDesk(b215, desk2office2desksB2, "Desk B215 2");
	
	        Desk deskB216_1 = createDesk(b216, desk1office4desksB2, "Desk B216 1");
	        Desk deskB216_2 = createDesk(b216, desk2office4desksB2, "Desk B216 2");
	        Desk deskB216_3 = createDesk(b216, desk3office4desksB2, "Desk B216 3");
	        Desk deskB216_4 = createDesk(b216, desk4office4desksB2, "Desk B216 4");
	
	        Desk deskB217_1 = createDesk(b217, desk1office2desksB2, "Desk B217 1");
	        Desk deskB217_2 = createDesk(b217, desk2office2desksB2, "Desk B217 2");
	
	        Desk deskB218_1 = createDesk(b218, desk1meetingRoomB2, "Desk B218 1");
	        Desk deskB218_2 = createDesk(b218, desk2meetingRoomB2, "Desk B218 2");
	        Desk deskB218_3 = createDesk(b218, desk3meetingRoomB2, "Desk B218 3");
	        Desk deskB218_4 = createDesk(b218, desk4meetingRoomB2, "Desk B218 4");
	        Desk deskB218_5 = createDesk(b218, desk5meetingRoomB2, "Desk B218 5");
	        Desk deskB218_6 = createDesk(b218, desk6meetingRoomB2, "Desk B218 6");
	
	        Desk deskB218b_1 = createDesk(b218b, desk1office2desksB2, "Desk B218b 1");
	        Desk deskB218b_2 = createDesk(b218b, desk2office2desksB2, "Desk B218b 2");
	
	        Desk deskB219_1 = createDesk(b219, desk1office1deskB2, "Desk B219 1");
	
	        Desk deskB220_1 = createDesk(b220, desk1office2desksB2, "Desk B220 1");
	        Desk deskB220_2 = createDesk(b220, desk2office2desksB2, "Desk B220 2");
	
	        Desk deskB221_1 = createDesk(b221, desk1office3desksB2, "Desk B221 1");
	        Desk deskB221_2 = createDesk(b221, desk2office3desksB2, "Desk B221 2");
	        Desk deskB221_3 = createDesk(b221, desk3office3desksB2, "Desk B221 3");
	
	        Desk deskB222_1 = createDesk(b222, desk1office1deskB2, "Desk B222 1");
	        Desk deskB223_1 = createDesk(b223, desk1office1deskB2, "Desk B223 1");
	
	        Desk deskB224_1 = createDesk(b224, desk1office2desksB2, "Desk B224 1");
	        Desk deskB224_2 = createDesk(b224, desk2office2desksB2, "Desk B224 2");
	
	        Desk deskB225_1 = createDesk(b225, desk1office1deskB2, "Desk B225 1");
	
	        Desk deskB226_1 = createDesk(b226, desk1office2desksB2, "Desk B226 1");
	        Desk deskB226_2 = createDesk(b226, desk2office2desksB2, "Desk B226 2");
	
	        Desk deskB227_1 = createDesk(b227, desk1office1deskB2, "Desk B227 1");
	
	        Desk deskB229_1 = createDesk(b229, desk1office2desksB2, "Desk B229 1");
	        Desk deskB229_2 = createDesk(b229, desk2office2desksB2, "Desk B229 2");
	
	        Desk deskB231_1 = createDesk(b231, desk1office3desksB2, "Desk B231 1");
	        Desk deskB231_2 = createDesk(b231, desk2office3desksB2, "Desk B231 2");
	        Desk deskB231_3 = createDesk(b231, desk3office3desksB2, "Desk B231 3");
	
	        Desk deskB233_1 = createDesk(b233, desk1office1deskB2, "Desk B233 1");
	        Desk deskB236_1 = createDesk(b236, desk1office1deskB2, "Desk B236 1");
	        Desk deskB238_1 = createDesk(b238, desk1office1deskB2, "Desk B238 1");
	
	        Desk deskB239_1 = createDesk(b239, desk1office3desksB2, "Desk B239 1");
	        Desk deskB239_2 = createDesk(b239, desk2office3desksB2, "Desk B239 2");
	        Desk deskB239_3 = createDesk(b239, desk3office3desksB2, "Desk B239 3");
	
	        Desk deskB240_1 = createDesk(b240, desk1office2desksB2, "Desk B240 1");
	        Desk deskB240_2 = createDesk(b240, desk2office2desksB2, "Desk B240 2");
	
	        Desk deskB241_1 = createDesk(b241, desk1office3desksB2, "Desk B241 1");
	        Desk deskB241_2 = createDesk(b241, desk2office3desksB2, "Desk B241 2");
	        Desk deskB241_3 = createDesk(b241, desk3office3desksB2, "Desk B241 3");
	
	        Desk deskB242_1 = createDesk(b242, desk1office1deskB2, "Desk B242 1");
	
	        Desk deskB243_1 = createDesk(b243, desk1office5desksB2, "Desk B243 1");
	        Desk deskB243_2 = createDesk(b243, desk2office5desksB2, "Desk B243 2");
	        Desk deskB243_3 = createDesk(b243, desk3office5desksB2, "Desk B243 3");
	        Desk deskB243_4 = createDesk(b243, desk4office5desksB2, "Desk B243 4");
	        Desk deskB243_5 = createDesk(b243, desk5office5desksB2, "Desk B243 5");
	
	        Desk deskB244_1 = createDesk(b244, desk1office1deskB2, "Desk B244 1");
	        
         // --- EMPLOYEES COULOIR B2 ---

            Employee hugoBruneliere = createEmployeeWithAccount(
                "Hugo", "Bruneliere", deskB206_1,
                buildImtEmail("Hugo", "Bruneliere"),
                "02 51 85 82 21", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
            );

            Employee theoLeCalvar = createEmployeeWithAccount(
                "Théo", "Le Calvar", deskB206_2,
                buildImtEmail("Théo", "Le Calvar"),
                "02 51 85 87 95", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
            );

            Employee dalilaTamzalit = createEmployeeWithAccount(
                "Dalila", "Tamzalit", deskB206_3,
                buildImtEmail("Dalila", "Tamzalit"),
                "02 51 85 80 54", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.WOMAN1
            );

            Employee alexisBitaillou = createEmployeeWithAccount(
                "Alexis", "Bitaillou", deskB206b_1,
                buildImtEmail("Alexis", "Bitaillou"),
                "", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN4
            );

            Employee charlesPrudhomme = createEmployeeWithAccount(
                "Charles", "Prudhomme", deskB207_1,
                buildImtEmail("Charles", "Prudhomme"),
                "02 51 85 83 68", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
            );

            Employee julienCohen = createEmployeeWithAccount(
                "Julien", "Cohen", deskB208_1,
                buildImtEmail("Julien", "Cohen"),
                "", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN4
            );

            Employee nicolasBeldiceanu = createEmployeeWithAccount(
                "Nicolas", "Beldiceanu", deskB209_1,
                buildImtEmail("Nicolas", "Beldiceanu"),
                "02 51 85 82 42", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN1
            );

            Employee matthewCoyle = createEmployeeWithAccount(
                "Matthew", "Coyle", deskB210_1,
                buildImtEmail("Matthew", "Coyle"),
                "", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
            );

            Employee charlotteTruchet = createEmployeeWithAccount(
                "Charlotte", "Truchet", deskB210_2,
                buildImtEmail("Charlotte", "Truchet"),
                "02 51 85 82 25", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.WOMAN3
            );

            Employee wedwangMenra = createEmployeeWithAccount(
                "Wedwang Romial", "Menra", deskB210_3,
                buildImtEmail("Wedwang Romial", "Menra"),
                "07 51 09 16 32", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN4
            );

            Employee gillesSimonin = createEmployeeWithAccount(
                "Gilles", "Simonin", deskB211b_1,
                buildImtEmail("Gilles", "Simonin"),
                "02 51 85 80 22", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN1
            );

            Employee anneClaireBinetruy = createEmployeeWithAccount(
                "Anne Claire", "Binetruy", deskB212b_1,
                buildImtEmail("Anne Claire", "Binetruy"),
                "02 51 85 87 24", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.WOMAN3
            );

            Employee alexandreDolgui = createEmployeeWithAccount(
                "Alexandre", "Dolgui", deskB213_1,
                buildImtEmail("Alexandre", "Dolgui"),
                "06 26 30 30 94", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
            );

            Employee catherineFourny = createEmployeeWithAccount(
                "Catherine", "Fourny", deskB214_1,
                buildImtEmail("Catherine", "Fourny"),
                "02 51 85 82 12", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.WOMAN1
            );

            Employee samirLoudni = createEmployeeWithAccount(
                "Samir", "Loudni", deskB215_1,
                buildImtEmail("Samir", "Loudni"),
                "02 51 85 83 04", "08:00-16:00",
                WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
            );

            Employee tudorOpran = createEmployeeWithAccount(
                "Tudor Matei", "Opran", deskB215_2,
                buildImtEmail("Tudor Matei", "Opran"),
                "", "08:00-16:00",
                WorkLocation.REMOTE, EmployeeStatus.AVAILABLE, Sprite.MAN2
            );
            Employee adrienLebre = createEmployeeWithAccount(
        	    "Adrien", "Lebre", deskB216_1,
        	    buildImtEmail("Adrien", "Lebre"),
        	    "02 51 85 82 43", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN4
        	);

        	Employee pierreMariePedrot = createEmployeeWithAccount(
        	    "Pierre-Marie", "Pedrot", deskB216_2,
        	    buildImtEmail("Pierre-Marie", "Pedrot"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN1
        	);

        	Employee matthieuSozeau = createEmployeeWithAccount(
        	    "Matthieu", "Sozeau", deskB216_3,
        	    buildImtEmail("Matthieu", "Sozeau"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
        	);

        	Employee nicolasTabareau = createEmployeeWithAccount(
        	    "Nicolas", "Tabareau", deskB216_4,
        	    buildImtEmail("Nicolas", "Tabareau"),
        	    "02 51 85 82 37", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee baptisteJonglez = createEmployeeWithAccount(
        	    "Baptiste", "Jonglez", deskB217_1,
        	    buildImtEmail("Baptiste", "Jonglez"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee lucienAstie = createEmployeeWithAccount(
        	    "Lucien", "Astie", deskB217_2,
        	    buildImtEmail("Lucien", "Astie"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN1
        	);

        	Employee danielBalouekThomert = createEmployeeWithAccount(
        	    "Daniel", "Balouek-Thomert", deskB218_1,
        	    buildImtEmail("Daniel", "Balouek-Thomert"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN4
        	);

        	Employee severinAnzie = createEmployeeWithAccount(
        	    "Severin Bradley", "Anzie", deskB218_2,
        	    buildImtEmail("Severin Bradley", "Anzie"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
        	);

        	Employee carinaHuynh = createEmployeeWithAccount(
        	    "Carina", "Huynh", deskB218_6,
        	    buildImtEmail("Carina", "Huynh"),
        	    "02 51 85 82 25", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.WOMAN4
        	);

        	Employee heleneCoullon = createEmployeeWithAccount(
        	    "Hélène", "Coullon", deskB218b_1,
        	    buildImtEmail("Hélène", "Coullon"),
        	    "02 51 85 82 96", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.WOMAN3
        	);

        	Employee gaetanPlisson = createEmployeeWithAccount(
        	    "Gaetan", "Plisson", deskB218b_2,
        	    buildImtEmail("Gaetan", "Plisson"),
        	    "06 50 21 42 03", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee philippeDavid = createEmployeeWithAccount(
        	    "Philippe", "David", deskB219_1,
        	    buildImtEmail("Philippe", "David"),
        	    "02 51 85 82 27", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee sanchjeevKarikalan = createEmployeeWithAccount(
        	    "Sanchjeev", "Karikalan", deskB221_1,
        	    buildImtEmail("Sanchjeev", "Karikalan"),
        	    "07 67 50 01 46", "08:00-16:00",
        	    WorkLocation.REMOTE, EmployeeStatus.ABSENT, Sprite.MAN3
        	);

        	Employee sulianLeBozec = createEmployeeWithAccount(
        	    "Sulian", "Le Bozec Chiffoleau", deskB221_2,
        	    buildImtEmail("Sulian", "Le Bozec Chiffoleau"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee celesteGuimapi = createEmployeeWithAccount(
        	    "Celeste Precil", "Guimapi Guefack", deskB221_3,
        	    buildImtEmail("Celeste Precil", "Guimapi Guefack"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN4
        	);

        	Employee guillaumeRosinosky = createEmployeeWithAccount(
        	    "Guillaume", "Rosinosky", deskB222_1,
        	    buildImtEmail("Guillaume", "Rosinosky"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN1
        	);

        	Employee thomasLedoux = createEmployeeWithAccount(
        	    "Thomas", "Ledoux", deskB223_1,
        	    buildImtEmail("Thomas", "Ledoux"),
        	    "02 51 85 82 19", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.OCCUPIED, Sprite.MAN2
        	);

        	Employee marioSudholt = createEmployeeWithAccount(
        	    "Mario", "Sudholt", deskB224_1,
        	    buildImtEmail("Mario", "Sudholt"),
        	    "02 51 85 82 47", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.ABSENT, Sprite.MAN1
        	);

        	Employee carlosGonzalez = createEmployeeWithAccount(
        	    "Carlos Javier", "Gonzalez Santamaria", deskB224_2,
        	    buildImtEmail("Carlos Javier", "Gonzalez Santamaria"),
        	    "02 51 85 80 28", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
        	);

        	Employee remiDouence = createEmployeeWithAccount(
        	    "Remi", "Douence", deskB225_1,
        	    buildImtEmail("Remi", "Douence"),
        	    "02 51 85 82 15", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee assiaMahboubi = createEmployeeWithAccount(
        	    "Assia", "Mahboubi", deskB226_1,
        	    buildImtEmail("Assia", "Mahboubi"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.WOMAN2
        	);

        	Employee romualdDebruyne = createEmployeeWithAccount(
        	    "Romuald", "Debruyne", deskB227_1,
        	    buildImtEmail("Romuald", "Debruyne"),
        	    "02 51 85 82 11", "08:00-16:00",
        	    WorkLocation.REMOTE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee massimoTisi = createEmployeeWithAccount(
        	    "Massimo", "Tisi", deskB229_1,
        	    buildImtEmail("Massimo", "Tisi"),
        	    "02 51 85 87 04", "08:00-16:00",
        	    WorkLocation.REMOTE, EmployeeStatus.OCCUPIED, Sprite.MAN2
        	);

        	Employee jeanMarieMottu = createEmployeeWithAccount(
        	    "Jean-Marie", "Mottu", deskB229_2,
        	    buildImtEmail("Jean-Marie", "Mottu"),
        	    "02 51 85 82 13", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
        	);

        	Employee hibaAjabri = createEmployeeWithAccount(
        	    "Hiba", "Ajabri", deskB231_1,
        	    buildImtEmail("Hiba", "Ajabri"),
        	    "", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.WOMAN4
        	);

        	Employee fredericLievre = createEmployeeWithAccount(
        	    "Frederic", "Lievre", deskB233_1,
        	    buildImtEmail("Frederic", "Lievre"),
        	    "02 51 85 81 76", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN1
        	);

        	Employee kaddourFellah = createEmployeeWithAccount(
        	    "Kaddour", "Fellah", deskB236_1,
        	    buildImtEmail("Kaddour", "Fellah"),
        	    "02 51 85 81 79", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
        	);

        	Employee philippeGirod = createEmployeeWithAccount(
        	    "Philippe", "Girod", deskB239_1,
        	    buildImtEmail("Philippe", "Girod"),
        	    "02 51 85 87 72", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN4
        	);

        	Employee herveRozec = createEmployeeWithAccount(
        	    "Hervé", "Rozec", deskB239_2,
        	    buildImtEmail("Hervé", "Rozec"),
        	    "02 51 85 81 77", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee simonVilchien = createEmployeeWithAccount(
        	    "Simon", "Vilchien", deskB240_1,
        	    buildImtEmail("Simon", "Vilchien"),
        	    "02 51 85 87 73", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee ludovicDelos = createEmployeeWithAccount(
        	    "Ludovic", "Delos", deskB241_1,
        	    buildImtEmail("Ludovic", "Delos"),
        	    "02 51 85 81 83", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN4
        	);

        	Employee vincentBrard = createEmployeeWithAccount(
        	    "Vincent", "Brard", deskB241_2,
        	    buildImtEmail("Vincent", "Brard"),
        	    "02 51 85 81 82", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
        	);

        	Employee gerardNguyenVanTu = createEmployeeWithAccount(
        	    "Gerard", "Nguyen-Van-Tu", deskB241_3,
        	    buildImtEmail("Gerard", "Nguyen-Van-Tu"),
        	    "02 51 85 81 78", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee delphineDevos = createEmployeeWithAccount(
        	    "Delphine", "Devos", deskB242_1,
        	    buildImtEmail("Delphine", "Devos"),
        	    "02 51 85 87 91", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.WOMAN1
        	);

        	Employee loicDubocquet = createEmployeeWithAccount(
        	    "Loic", "Dubocquet", deskB243_1,
        	    buildImtEmail("Loic", "Dubocquet"),
        	    "02 51 85 80 85", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee pascalSakalakis = createEmployeeWithAccount(
        	    "Pascal", "Sakalakis", deskB243_2,
        	    buildImtEmail("Pascal", "Sakalakis"),
        	    "02 51 85 80 90", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN1
        	);

        	Employee briceVerger = createEmployeeWithAccount(
        	    "Brice", "Verger", deskB243_3,
        	    buildImtEmail("Brice", "Verger"),
        	    "02 51 85 81 74", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN3
        	);

        	Employee christianCormerais = createEmployeeWithAccount(
        	    "Christian", "Cormerais", deskB243_4,
        	    buildImtEmail("Christian", "Cormerais"),
        	    "02 51 85 85 73", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);

        	Employee brianGuedos = createEmployeeWithAccount(
        	    "Brian Casimir", "Guedos", deskB243_5,
        	    buildImtEmail("Brian Casimir", "Guedos"),
        	    "02 29 00 15 82", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN1
        	);

        	Employee laurentMenuKerforn = createEmployeeWithAccount(
        	    "Laurent", "Menu-Kerforn", deskB244_1,
        	    buildImtEmail("Laurent", "Menu-Kerforn"),
        	    "02 51 85 81 75", "08:00-16:00",
        	    WorkLocation.OFFICE, EmployeeStatus.AVAILABLE, Sprite.MAN2
        	);
            
            Meeting prepLogin = meetingRepo.save(
    		    Meeting.builder()
    		        .room(b218)
    		        .title("Préparation cours LOGIN")
    		        .startingHour(LocalDateTime.of(2026, 3, 20, 13, 0))
    		        .endHour(LocalDateTime.of(2026, 3, 20, 14, 0))
    		        .description("Préparation de l’année 2026-2027 en TAF LOGIN")
    		        .build()
    		);

    		Meeting prepDcl = meetingRepo.save(
    		    Meeting.builder()
    		        .room(b218)
    		        .title("Préparation cours DCL")
    		        .startingHour(LocalDateTime.of(2026, 3, 20, 14, 0))
    		        .endHour(LocalDateTime.of(2026, 3, 20, 14, 30))
    		        .description("Préparation de l’année 2026-2027 en TAF DCL")
    		        .build()
    		);
    		meetingRepo.flush();
    		
    		meetingEmployeeRepo.save(new MeetingEmployee(prepLogin, heleneCoullon, true, false));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepLogin, theoLeCalvar, true, true));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepLogin, baptisteJonglez, true, false));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepLogin, danielBalouekThomert, true, false));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepLogin, guillaumeRosinosky, true, false));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepLogin, remiDouence, true, false));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepLogin, massimoTisi, false, false));

    		meetingEmployeeRepo.save(new MeetingEmployee(prepDcl, theoLeCalvar, true, false));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepDcl, remiDouence, true, false));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepDcl, massimoTisi, true, false));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepDcl, matthewCoyle, true, true));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepDcl, sanchjeevKarikalan, true, true));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepDcl, marioSudholt, false, false));
    		meetingEmployeeRepo.save(new MeetingEmployee(prepDcl, carlosGonzalez, true, false));

    		meetingEmployeeRepo.flush();
            
            // --- DESKS ---
            /*Desk deskA105 = deskRepo.save(
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
            );*/

            // --- EMPLOYEES ---
            /*Employee alice = createEmployeeWithAccount(
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

            Employee bob = createEmployeeWithAccount(
                    "Bob",
                    "Martin",
                    deskA106,
                    "bob.martin@keliocity.com",
                    "0611223344",
                    "08:00-16:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.OCCUPIED,
                    Sprite.MAN1
            );

            Employee jade = createEmployeeWithAccount(
                    "Jade",
                    "Bernard",
                    deskA107_1,
                    "jade.bernard@keliocity.com",
                    "0611020777",
                    "09:00-17:00",
                    WorkLocation.OFFICE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.WOMAN2
            );

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

            Employee paul = createEmployeeWithAccount(
                    "Paul",
                    "Lefevre",
                    deskA108_1,
                    "paul.lefevre@keliocity.com",
                    "0681283384",
                    "08:00-16:00",
                    WorkLocation.REMOTE,
                    EmployeeStatus.AVAILABLE,
                    Sprite.MAN2
            );

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
            );

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
            );

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
            );

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
            );

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
            );

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
            );

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
            );*/

            // Employees and desks for openspaces
            /*List<Person> people = List.of(
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
                            .deskNumber(2*i+1)
                            .build()
                );
                deskType_openspaces[1][i] = deskTypeRepo.save(
                    DeskType.builder()
                            .coordX(1.68f + 2.52f * i)
                            .coordZ(3.1f)
                            .orientationDeg(180f)
                            .roomType(openspace)
                            .deskNumber(2*i+2)
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
            meetingEmployeeRepo.flush();*/

            System.out.println("✔ Base de données initialisée !");
        }
    }
    public static record Person(String lastname, String firstname, String gender) {}
}
