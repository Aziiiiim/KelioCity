package com.keliocity.backend.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Data;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingEmployeeId implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer meetingId;
    private Integer employeeId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MeetingEmployeeId that)) return false;
        return Objects.equals(meetingId, that.meetingId)
                && Objects.equals(employeeId, that.employeeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(meetingId, employeeId);
    }
}
