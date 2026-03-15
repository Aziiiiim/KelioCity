package com.keliocity.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.time.LocalDateTime;

@Entity
@Table(name = "MEETINGS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
	
	@ManyToOne(optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "desk_id")
    private Desk desk; // optionnel

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "starting_hour", nullable = false)
    private LocalDateTime startingHour;

    @Column(name = "end_hour", nullable = false)
    private LocalDateTime endHour;

    @Column(name = "description")
    private String description;

    @PrePersist
    public void setDefaultValues() {
        if (this.startingHour == null) {
            this.startingHour = LocalDateTime.now();
        }
        if (this.endHour == null) {
            this.endHour = LocalDateTime.now().plusHours(1);
        }

        if (this.description == null || this.description == "") {
            this.description = "Non communiqué";
        }
    }
}
