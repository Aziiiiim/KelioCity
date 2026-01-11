package com.keliocity.backend.config;

import com.keliocity.backend.model.*;
import com.keliocity.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public void run(String... args) {

        if (roomRepo.count() == 0) {
            System.out.println("➡️ Initialisation de la base de données…");

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
                        .coordX1(-25f).coordZ1(-13f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA103 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A103")
                        .coordX1(13f).coordZ1(25f)
                        .orientationDeg(90f)
                        .build()
            );

            Room roomA104 = roomRepo.save(
                    Room.builder()
                        .roomType(meetingRoom)
                        .roomName("A104")
                        .coordX1(1f).coordZ1(25f)
                        .orientationDeg(90f)
                        .build()
            );

            Room roomA105 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A105")
                        .coordX1(19f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA106 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A106")
                        .coordX1(13f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA107 = roomRepo.save(
                    Room.builder()
                        .roomType(office2Desks)
                        .roomName("A107")
                        .coordX1(6.99f).coordZ1(-20f)
                        .orientationDeg(90f)
                        .build()
            );

            Room roomA108 = roomRepo.save(
                    Room.builder()
                        .roomType(office4Desks)
                        .roomName("A108")
                        .coordX1(-0.02f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA109 = roomRepo.save(
                    Room.builder()
                        .roomType(office6Desks)
                        .roomName("A109")
                        .coordX1(-2.99f).coordZ1(-1f)
                        .orientationDeg(180f)
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
                        .coordX1(16f).coordZ1(8f)
                        .orientationDeg(90f)
                        .openspaceNumber(10)
                        .build()
            );

            Room openspace_5 = roomRepo.save(
                    Room.builder()
                        .roomType(openspace)
                        .roomName("OA100_005")
                        .coordX1(4f).coordZ1(8f)
                        .orientationDeg(90f)
                        .openspaceNumber(10)
                        .build()
            );


            // --- DESKS ---
            Desk deskA105 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A105")
                        .room(roomA105)
                        .coordX(22.1f).coordZ(-23f)
                        .orientationDeg(0f)
                        .build()
            );

            Desk deskA106 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A106")
                        .room(roomA106)
                        .coordX(16.1f).coordZ(-23f)
                        .orientationDeg(0f)
                        .build()
            );

            Desk deskA107_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A107 1")
                        .room(roomA107)
                        .coordX(10.97f).coordZ(-23.61f)
                        .orientationDeg(90f)
                        .build()
            );

            Desk deskA107_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A107 2")
                        .room(roomA107)
                        .coordX(9.2f).coordZ(-21.4f)
                        .orientationDeg(-90f)
                        .build()
            );

            Desk deskA108_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108 1")
                        .room(roomA108)
                        .coordX(2.205f).coordZ(-23.325f)
                        .orientationDeg(90f)
                        .build()
            );

            Desk deskA108_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108 2")
                        .room(roomA108)
                        .coordX(2.218f).coordZ(-21.045f)
                        .orientationDeg(90f)
                        .build()
            );

            Desk deskA108_3 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108 3")
                        .room(roomA108)
                        .coordX(4.679f).coordZ(-22.858f)
                        .orientationDeg(-90f)
                        .build()
            );

            Desk deskA108_4 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108 4")
                        .room(roomA108)
                        .coordX(4.679f).coordZ(-20.533f)
                        .orientationDeg(-90f)
                        .build()
            );

            Desk deskA109_1 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 1")
                        .room(roomA109)
                        .coordX(-7.566f).coordZ(-8.3f)
                        .orientationDeg(-90f)
                        .build()
            );

            Desk deskA109_2 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 1")
                        .room(roomA109)
                        .coordX(-7.566f).coordZ(-6.132f)
                        .orientationDeg(-90f)
                        .build()
            );

            Desk deskA109_3 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 1")
                        .room(roomA109)
                        .coordX(-7.566f).coordZ(-3.8f)
                        .orientationDeg(-90f)
                        .build()
            );

            Desk deskA109_4 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 1")
                        .room(roomA109)
                        .coordX(-5.185f).coordZ(-7.773f)
                        .orientationDeg(90f)
                        .build()
            );

            Desk deskA109_5 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 1")
                        .room(roomA109)
                        .coordX(-5.185f).coordZ(-5.49f)
                        .orientationDeg(90f)
                        .build()
            );

            Desk deskA109_6 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A109 1")
                        .room(roomA109)
                        .coordX(-5.185f).coordZ(-3.2f)
                        .orientationDeg(90f)
                        .build()
            );

            // --- EMPLOYEES ---
            Employee alice = employeeRepo.save(
                    Employee.builder()
                        .firstName("Alice")
                        .lastName("Dupont")
                        .desk(deskA105)
                        .email("alice.dupont@keliocity.com")
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
                        .email("bob.martin@keliocity.com")
                        .phoneNumber("0611223344")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.OCCUPIED)
                        .sprite(Sprite.MAN1)
                        .build()
            );

            Employee jade = employeeRepo.save(
                    Employee.builder()
                        .firstName("Jade")
                        .lastName("Bernard")
                        .desk(deskA107_1)
                        .email("jade.bernard@keliocity.com")
                        .phoneNumber("0611020777")
                        .workingHours("09:00-17:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.AVAILABLE)
                        .sprite(Sprite.WOMAN2)
                        .build()
            );

            Employee pol = employeeRepo.save(
                    Employee.builder()
                        .firstName("Pol")
                        .lastName("Meuler")
                        .desk(deskA107_2)
                        .email("pol.meuler@keliocity.com")
                        .phoneNumber("0611721777")
                        .workingHours("09:00-17:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.AVAILABLE)
                        .sprite(Sprite.MAN2)
                        .build()
            );

            Employee paul = employeeRepo.save(
                    Employee.builder()
                        .firstName("Paul")
                        .lastName("Lefevre")
                        .desk(deskA108_1)
                        .email("paul.lefevre@keliocity.com")
                        .phoneNumber("0681283384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.REMOTE)
                        .status(EmployeeStatus.AVAILABLE)
                        .sprite(Sprite.MAN2)
                        .build()
            );

            Employee jacob = employeeRepo.save(
                    Employee.builder()
                        .firstName("Jacob")
                        .lastName("Clair")
                        .desk(deskA108_2)
                        .email("jacob.clair@keliocity.com")
                        .phoneNumber("0681243384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.ABSENT)
                        .sprite(Sprite.MAN1)
                        .build()
            );

            Employee alicia = employeeRepo.save(
                    Employee.builder()
                        .firstName("Alicia")
                        .lastName("Rodriguez")
                        .desk(deskA108_3)
                        .email("alicia.rodriguez@keliocity.com")
                        .phoneNumber("0681283389")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.OCCUPIED)
                        .sprite(Sprite.WOMAN2)
                        .build()
            );

            Employee marguerite = employeeRepo.save(
                    Employee.builder()
                        .firstName("Marguerite")
                        .lastName("Diatre")
                        .desk(deskA108_4)
                        .email("marguerite.diatre@keliocity.com")
                        .phoneNumber("0681203384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.OCCUPIED)
                        .sprite(Sprite.WOMAN1)
                        .build()
            );

            Employee alexis = employeeRepo.save(
                    Employee.builder()
                        .firstName("Alexis")
                        .lastName("Dialo")
                        .desk(deskA109_1)
                        .email("alexis.dialo@keliocity.com")
                        .phoneNumber("0781203384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.REMOTE)
                        .status(EmployeeStatus.AVAILABLE)
                        .sprite(Sprite.MAN3)
                        .build()
            );

            Employee jeanne = employeeRepo.save(
                    Employee.builder()
                        .firstName("Jeanne")
                        .lastName("Dargen")
                        .desk(deskA109_2)
                        .email("jeanne.dargen@keliocity.com")
                        .phoneNumber("0681201384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.AVAILABLE)
                        .sprite(Sprite.WOMAN3)
                        .build()
            );

            Employee matthieu = employeeRepo.save(
                    Employee.builder()
                        .firstName("Matthieu")
                        .lastName("Ness")
                        .desk(deskA109_3)
                        .email("matthieu.ness@keliocity.com")
                        .phoneNumber("0681803384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.AVAILABLE)
                        .sprite(Sprite.MAN4)
                        .build()
            );

            Employee jacques = employeeRepo.save(
                    Employee.builder()
                        .firstName("Jacques")
                        .lastName("Marlot")
                        .desk(deskA109_4)
                        .email("jacques.marlot@keliocity.com")
                        .phoneNumber("0681243384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.OFFICE)
                        .status(EmployeeStatus.ABSENT)
                        .sprite(Sprite.MAN1)
                        .build()
            );

            Employee alphonsine = employeeRepo.save(
                    Employee.builder()
                        .firstName("Alphonsine")
                        .lastName("Sauvignon")
                        .desk(deskA109_5)
                        .email("alphonsine.sauvignon@keliocity.com")
                        .phoneNumber("0631203384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.REMOTE)
                        .status(EmployeeStatus.AVAILABLE)
                        .sprite(Sprite.WOMAN1)
                        .build()
            );

            Employee Hector = employeeRepo.save(
                    Employee.builder()
                        .firstName("Hector")
                        .lastName("De Thouars")
                        .desk(deskA109_6)
                        .email("hector.dethouars@keliocity.com")
                        .phoneNumber("0681000384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.REMOTE)
                        .status(EmployeeStatus.OCCUPIED)
                        .sprite(Sprite.WOMAN1)
                        .build()
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
                new Person("Couture", "Isabelle", "F"),
                new Person("Legrand", "Fabien", "H"),
                new Person("Rousseau", "Amélie", "F"),
                new Person("Monnier", "Samuel", "H"),
                new Person("Hubert", "Delphine", "F"),
                new Person("Noël", "Maxime", "H"),
                new Person("Bastien", "Emilie", "F"),
                new Person("Guyon", "Laurent", "H"),
                new Person("Poitou", "Aurélie", "F"),
                new Person("Camus", "Niels", "H")
            );

            Room[] openspaces = {openspace_1, openspace_2, openspace_3, openspace_4, openspace_5};

            for (int j=0; j<3; j++) {
                for (int i=0; i<7; i++) {
                    if (j != 2 || i < 5) {
                        Desk deskD_openspace = deskRepo.save(
                            Desk.builder()
                                .deskName("Desk OA100_00"+(j+1)+" "+(2*i+1))
                                .room(openspaces[j])
                                .coordX((-19.75f+2.52f*i)).coordZ(18.3f-8f*j)
                                .orientationDeg(0f)
                                .build()
                        );
                        deskRepo.flush();
                        String spriteD;
                        if (people.get(14*j+i).gender.equals("H")) {
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
                        Employee employeeD = employeeRepo.save(
                            Employee.builder()
                                .firstName(people.get(14*j+2*i).firstname)
                                .lastName(people.get(14*j+2*i).lastname)
                                .desk(deskD_openspace)
                                .email(people.get(14*j+2*i).firstname.toLowerCase()+"."+people.get(14*j+2*i).lastname.toLowerCase()+"@keliocity.com")
                                .phoneNumber("068"+j+"28399"+i)
                                .workingHours("08:00-16:00")
                                .inOffice(workLocation)
                                .status(employeeStatus)
                                .sprite(Sprite.valueOf(spriteD))
                                .build()
                        );
                        employeeRepo.flush();
                        Desk deskG_openspace = deskRepo.save(
                            Desk.builder()
                                .deskName("Desk OA100_00"+(j+1)+" "+(2*i+2))
                                .room(openspaces[j])
                                .coordX(-20.35f+2.52f*i).coordZ(21.1f-8f*j)
                                .orientationDeg(180f)
                                .build()
                        );
                        deskRepo.flush();
                        String spriteG;
                        if (people.get(14*j+2*i+1).gender.equals("H")) {
                            spriteG = "MAN"+((i%4)+1);
                        } else {
                            spriteG = "WOMAN"+((i%4)+1);
                        }
                        Employee employeeG = employeeRepo.save(
                            Employee.builder()
                                .firstName(people.get(14*j+2*i+1).firstname)
                                .lastName(people.get(14*j+2*i+1).lastname)
                                .desk(deskG_openspace)
                                .email(people.get(14*j+2*i+1).firstname.toLowerCase()+"."+people.get(14*j+2*i+1).lastname.toLowerCase()+"@keliocity.com")
                                .phoneNumber("06"+j+"128999"+i)
                                .workingHours("08:00-16:00")
                                .inOffice(WorkLocation.OFFICE)
                                .status(EmployeeStatus.AVAILABLE)
                                .sprite(Sprite.valueOf(spriteG))
                                .build()
                        );
                        employeeRepo.flush();
                    }
                }
            }

            for (int j=0; j<2; j++) {
                for (int i=0; i<9; i++) {
                    Desk deskD_openspace = deskRepo.save(
                        Desk.builder()
                            .deskName("Desk OA100_00"+(j+4)+" "+(2*i+1))
                            .room(openspaces[j+3])
                            .coordX(16.3f-12f*j).coordZ(-16.9f+2.52f*i)
                            .orientationDeg(0f)
                            .build()
                    );
                    deskRepo.flush();
                    String spriteD;
                    if (people.get(20*j+2*i+19).gender.equals("H")) {
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
                    Employee employeeD = employeeRepo.save(
                        Employee.builder()
                            .firstName(people.get(20*j+2*i+19).firstname)
                            .lastName(people.get(20*j+2*i+19).lastname)
                            .desk(deskD_openspace)
                            .email(people.get(20*j+2*i+19).firstname.toLowerCase()+"."+people.get(20*j+2*i+19).lastname.toLowerCase()+"@keliocity.com")
                            .phoneNumber("067"+j+"28399"+i)
                            .workingHours("08:00-16:00")
                            .inOffice(workLocation)
                            .status(employeeStatus)
                            .sprite(Sprite.valueOf(spriteD))
                            .build()
                    );
                    employeeRepo.flush();
                    Desk deskG_openspace = deskRepo.save(
                        Desk.builder()
                            .deskName("Desk OA100_00"+(j+4)+" "+(2*i+2))
                            .room(openspaces[j+3])
                            .coordX(19.15f-12f*j).coordZ(-16.35f+2.52f*i)
                            .orientationDeg(180f)
                            .build()
                    );
                    deskRepo.flush();
                    String spriteG;
                    if (people.get(20*j+2*i+20).gender.equals("H")) {
                        spriteG = "MAN"+((i%4)+1);
                    } else {
                        spriteG = "WOMAN"+((i%4)+1);
                    }
                    Employee employeeG = employeeRepo.save(
                        Employee.builder()
                            .firstName(people.get(20*j+2*i+20).firstname)
                            .lastName(people.get(20*j+2*i+20).lastname)
                            .desk(deskG_openspace)
                            .email(people.get(20*j+2*i+20).firstname.toLowerCase()+"."+people.get(20*j+2*i+20).lastname.toLowerCase()+"@keliocity.com")
                            .phoneNumber("06"+j+"738999"+i)
                            .workingHours("08:00-16:00")
                            .inOffice(WorkLocation.OFFICE)
                            .status(EmployeeStatus.AVAILABLE)
                            .sprite(Sprite.valueOf(spriteG))
                            .build()
                    );
                    employeeRepo.flush();
                }
            }

            LocalDateTime today = LocalDateTime.now()
                    .withHour(0).withMinute(0).withSecond(0).withNano(0);

            LocalDateTime tomorrow = today.plusDays(1);

            List<Employee> employees = employeeRepo.findAll();
            List<Room> meetingRooms = roomRepo.findAll().stream()
                    .filter(r -> r.getRoomType().getRoomtypeName().equals("MeetingRoom"))
                    .toList();

            int meetingIndex = 0;
            for (Employee employee : employees) {

                // --- Réunion aujourd’hui ---
                LocalDateTime startToday = today.withHour(9 + (meetingIndex % 4));
                LocalDateTime endToday = startToday.plusHours(1);

                Meeting meetingToday = meetingRepo.save(
                    Meeting.builder()
                        .room(meetingRooms.get(meetingIndex % meetingRooms.size()))
                        .title("Réunion – " + employee.getFirstName())
                        .startingHour(startToday)
                        .endHour(endToday)
                        .description("Réunion projet")
                        .build()
                );
                meetingRepo.flush();

                meetingEmployeeRepo.save(
                    new MeetingEmployee(
                        meetingToday,
                        employee,
                        true,
                        employee.getInOffice() == WorkLocation.REMOTE
                    )
                );

                // --- Travail individuel aujourd’hui (focus) ---
                Meeting focusToday = meetingRepo.save(
                    Meeting.builder()
                        .room(meetingRooms.get(0))
                        .desk(employee.getDesk())
                        .title("Travail personnel")
                        .startingHour(today.withHour(18))
                        .endHour(today.withHour(19))
                        .description("Temps de concentration")
                        .build()
                );
                meetingRepo.flush();

                meetingEmployeeRepo.save(
                    new MeetingEmployee(
                        focusToday,
                        employee,
                        true,
                        employee.getInOffice() == WorkLocation.REMOTE
                    )
                );

                // --- Réunion demain ---
                LocalDateTime startTomorrow = tomorrow.withHour(10 + (meetingIndex % 3));

                Meeting meetingTomorrow = meetingRepo.save(
                    Meeting.builder()
                        .room(meetingRooms.get((meetingIndex + 1) % meetingRooms.size()))
                        .title("Point équipe")
                        .startingHour(startTomorrow)
                        .endHour(startTomorrow.plusMinutes(45))
                        .description("Synchronisation équipe")
                        .build()
                );
                meetingRepo.flush();

                meetingEmployeeRepo.save(
                    new MeetingEmployee(
                        meetingTomorrow,
                        employee,
                        true,
                        employee.getInOffice() == WorkLocation.REMOTE
                    )
                );

                meetingIndex++;
            }
            // - - - MEETINGS - - -
            Meeting meeting1 = meetingRepo.save(
                    Meeting.builder()
                        .room(roomA101)
                        .title("Réunion de rentrée")
                        .startingHour(today.withHour(9).plusMinutes(30))
                        .endHour(today.withHour(10).plusMinutes(30))
                        .description("Première réunion")
                        .build()
            );
            meetingRepo.flush();

            meetingEmployeeRepo.save(new MeetingEmployee(meeting1, jade, true, false));

            meetingEmployeeRepo.save(new MeetingEmployee(meeting1, bob, true, false));

            Meeting meeting2 = meetingRepo.save(
                    Meeting.builder()
                        .room(roomA102)
                        .title("Revue de Projet")

                        .startingHour(today.withHour(11).plusMinutes(30))
                        .endHour(today.withHour(14).plusMinutes(30))
                        .description("Revue de projet PROCOM")
                        .build()
            );
            meetingRepo.flush();

            meetingEmployeeRepo.save(new MeetingEmployee(meeting2, alice, true, false));

            meetingEmployeeRepo.save(new MeetingEmployee(meeting2, paul, true, true));

            meetingEmployeeRepo.save(new MeetingEmployee(meeting2, jade, false, false));

            meetingEmployeeRepo.save(new MeetingEmployee(meeting2, bob, true, false));
            meetingEmployeeRepo.flush();

            System.out.println("✔ Base de données initialisée !");
        }
    }
    public static record Person(String lastname, String firstname, String gender) {}
}
