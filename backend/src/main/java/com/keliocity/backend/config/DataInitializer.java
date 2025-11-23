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

    public DataInitializer(RoomRepository roomRepo,
                           DeskRepository deskRepo,
                           EmployeeRepository employeeRepo) {
        this.roomRepo = roomRepo;
        this.deskRepo = deskRepo;
        this.employeeRepo = employeeRepo;
    }

    @Override
    public void run(String... args) {

        if (roomRepo.count() == 0) {
            System.out.println("➡️ Initialisation de la base de données…");

            // --- ROOMS ---
            Room roomA = roomRepo.save(
                    Room.builder()
                        .roomName("Open Space")
                        .coordX1(0f).coordZ1(0f)
                        .coordX2(20f).coordZ2(20f)
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
