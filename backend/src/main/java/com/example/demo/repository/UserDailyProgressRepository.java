package com.example.demo.repository;

import com.example.demo.model.UserDailyProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface UserDailyProgressRepository extends JpaRepository<UserDailyProgress, Long> {
    Optional<UserDailyProgress> findByUserIdAndProgressDate(Long userId, LocalDate date);
}
