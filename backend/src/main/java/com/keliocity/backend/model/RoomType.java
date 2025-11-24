package com.keliocity.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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

    @Column(name = "room_name", nullable = false)
    private String room_name;

    @Column(name = "length", nullable = false)
    private Float length;

    @Column(name = "width", nullable = false)
    private Float width;
}
