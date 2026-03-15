package com.keliocity.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.keliocity.backend.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer>{
    boolean existsByEmail(String email);
    Optional<Account> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "ALTER TABLE account AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();
}