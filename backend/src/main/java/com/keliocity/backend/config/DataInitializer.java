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
                        .roomName("A104")
                        .coordX1(19f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA106 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A105")
                        .coordX1(13f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA107 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
                        .roomName("A106")
                        .coordX1(7f).coordZ1(-25f)
                        .orientationDeg(0f)
                        .build()
            );

            Room roomA108 = roomRepo.save(
                    Room.builder()
                        .roomType(office1Desk)
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

            Desk deskA107 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A107")
                        .room(roomA107)
                        .coordX(10.1f).coordZ(-23f)
                        .orientationDeg(0f)
                        .build()
            );

            Desk deskA108 = deskRepo.save(
                    Desk.builder()
                        .deskName("Desk A108")
                        .room(roomA108)
                        .coordX(4.1f).coordZ(-23f)
                        .orientationDeg(0f)
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
                        .desk(deskA107)
                        .email("jade.bernard@keliocity.com")
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
                        .email("paul.lefevre@keliocity.com")
                        .phoneNumber("0681283384")
                        .workingHours("08:00-16:00")
                        .inOffice(WorkLocation.REMOTE)
                        .status(EmployeeStatus.OCCUPIED)
                        .sprite(Sprite.MAN2)
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
                        Employee employeeD = employeeRepo.save(
                            Employee.builder()
                                .firstName(people.get(14*j+2*i).firstname)
                                .lastName(people.get(14*j+2*i).lastname)
                                .desk(deskD_openspace)
                                .email(people.get(14*j+2*i).firstname.toLowerCase()+"."+people.get(14*j+2*i).lastname.toLowerCase()+"@keliocity.com")
                                .phoneNumber("068"+j+"28399"+i)
                                .workingHours("08:00-16:00")
                                .inOffice(WorkLocation.OFFICE)
                                .status(EmployeeStatus.AVAILABLE)
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
                for (int i=0; i<10; i++) {
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
                    Employee employeeD = employeeRepo.save(
                        Employee.builder()
                            .firstName(people.get(20*j+2*i+19).firstname)
                            .lastName(people.get(20*j+2*i+19).lastname)
                            .desk(deskD_openspace)
                            .email(people.get(20*j+2*i+19).firstname.toLowerCase()+"."+people.get(20*j+2*i+19).lastname.toLowerCase()+"@keliocity.com")
                            .phoneNumber("067"+j+"28399"+i)
                            .workingHours("08:00-16:00")
                            .inOffice(WorkLocation.OFFICE)
                            .status(EmployeeStatus.AVAILABLE)
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

            // - - - MEETINGS - - -
            Meeting meeting1 = meetingRepo.save(
                    Meeting.builder()
                        .room(roomA101)
                        .title("Réunion de rentrée")
                        .startingHour(LocalDateTime.of(2025,11,25,9,30))
                        .endHour(LocalDateTime.of(2025,11,25,10,30))
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
                        .startingHour(LocalDateTime.of(2025,11,25,11,30))
                        .endHour(LocalDateTime.of(2025,11,25,14,30))
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
