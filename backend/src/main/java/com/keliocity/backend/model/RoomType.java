package com.keliocity.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ROOM_TYPE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomType {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "roomtype_name", nullable = false)
    private String roomtypeName;

    @Column(name = "length_x", nullable = false)
    private Float lengthX;

    @Column(name = "length_z", nullable = false)
    private Float lengthZ;
}
