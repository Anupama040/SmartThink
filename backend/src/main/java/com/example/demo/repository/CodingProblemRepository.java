package com.example.demo.repository;

import com.example.demo.model.CodingProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodingProblemRepository extends JpaRepository<CodingProblem, Long> {
}
