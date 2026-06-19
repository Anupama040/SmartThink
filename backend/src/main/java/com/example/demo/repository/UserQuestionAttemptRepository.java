package com.example.demo.repository;

import com.example.demo.model.UserQuestionAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserQuestionAttemptRepository extends JpaRepository<UserQuestionAttempt, Long> {
    List<UserQuestionAttempt> findByUserId(Long userId);
    List<UserQuestionAttempt> findByUserIdAndAttemptDateTimeAfter(Long userId, LocalDateTime date);
    List<UserQuestionAttempt> findByUserIdAndIsCorrectFalse(Long userId);
}
