package com.keliocity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.keliocity.backend.model.Employee;
import com.keliocity.backend.model.EmployeeStatus;
import com.keliocity.backend.model.WorkLocation;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
	List<Employee> findByStatus(EmployeeStatus status);

    List<Employee> findByInOffice(WorkLocation location);

    List<Employee> findByDeskIsNull();

    List<Employee> findByDesk_Room_Id(Integer roomId);
}
