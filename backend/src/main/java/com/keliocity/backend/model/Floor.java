package com.keliocity.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "FLOOR")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Floor {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "floor_name", nullable = false)
    private String floorName;

    @Column(name = "length_x", nullable = false)
    private Float lengthX;

    @Column(name = "length_z", nullable = false)
    private Float lengthZ;
}
