package com.keliocity.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "FLOORS")
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

    @PrePersist
    public void setDefaultValues() {
        if (this.lengthX == null || this.lengthX == 0) {
            this.lengthX = 50.0f;
        }

        if (this.lengthZ == null || this.lengthZ == 0) {
            this.lengthZ = 50.0f;
        }
    }
}
