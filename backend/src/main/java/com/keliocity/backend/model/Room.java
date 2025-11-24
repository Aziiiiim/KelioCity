package com.keliocity.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ROOMS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "room_name", nullable = false)
    private String roomName;

    @Column(name = "coord_x1", nullable = false)
    private Float coordX1;

    @Column(name = "coord_z1", nullable = false)
    private Float coordZ1;

    @Column(name = "orientation_deg", nullable = false)
    private Float orientationDeg;

    @Column(name = "openspace_number", nullable = true)
    private Integer openspaceNumber;
}
