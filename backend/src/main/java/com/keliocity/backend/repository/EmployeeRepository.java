package com.keliocity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.keliocity.backend.model.Employee;
import com.keliocity.backend.model.EmployeeStatus;
import com.keliocity.backend.model.WorkLocation;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
	List<Employee> findByStatus(EmployeeStatus status);

    List<Employee> findByInOffice(WorkLocation location);

    List<Employee> findByDeskIsNull();

    List<Employee> findByDesk_Room_Id(Integer roomId);

    List<Employee> findByDesk_Room_Floor_id(Integer floorId);

    @Query("""
    SELECT e
    FROM Employee e
    LEFT JOIN e.desk d
    LEFT JOIN d.room r
    LEFT JOIN r.floor f
    WHERE
      f.id = :floorId
      AND
      (LOWER(CONCAT(e.firstName, ' ', e.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))
      OR
      LOWER(CONCAT(e.lastName, ' ', e.firstName)) LIKE LOWER(CONCAT('%', :name, '%')))
    """)
    List<Employee> searchByName(@Param("floorId") Integer floorId, @Param("name") String name);

    @Modifying
    @Transactional
    @Query(value = "ALTER TABLE employees AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();
}
