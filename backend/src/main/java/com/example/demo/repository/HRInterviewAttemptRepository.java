package com.example.demo.repository;

import com.example.demo.model.HRInterviewAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HRInterviewAttemptRepository extends JpaRepository<HRInterviewAttempt, Long> {
    List<HRInterviewAttempt> findByUserIdOrderByCreatedAtDesc(Long userId);
}
