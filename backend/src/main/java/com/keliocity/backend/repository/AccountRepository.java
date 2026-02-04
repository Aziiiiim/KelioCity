package com.keliocity.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import com.keliocity.backend.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer>{
    boolean existsByEmail(String email);
    Optional<Account> findByEmail(String email);
}