package com.keliocity.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DESKS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Desk {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "desk_name", nullable = false)
    private String deskName;

    @ManyToOne(optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "coord_x", nullable = false)
    private Float coordX;

    @Column(name = "coord_z", nullable = false)
    private Float coordZ;

    @Column(name = "orientation_deg", nullable = false)
    private Float orientationDeg;
}
