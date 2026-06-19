package com.example.demo.repository;

import com.example.demo.model.CodingAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingAttemptRepository extends JpaRepository<CodingAttempt, Long> {
    List<CodingAttempt> findByUserIdAndProblemIdOrderByCreatedAtDesc(Long userId, Long problemId);
}
