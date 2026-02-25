package com.keliocity.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DESK_TYPE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeskType {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "coord_x", nullable = false)
    private Float coordX;

    @Column(name = "coord_z", nullable = false)
    private Float coordZ;

    @Column(name = "orientation_deg", nullable = false)
    private Float orientationDeg;

    @ManyToOne
    @JoinColumn(name = "room_type", nullable = false)
    private RoomType roomType;

    @Column(name = "desk_number", nullable = false)
    private Integer deskNumber;
}
