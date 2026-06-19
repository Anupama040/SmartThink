package com.example.demo.repository;

import com.example.demo.model.HRQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HRQuestionRepository extends JpaRepository<HRQuestion, Long> {
    
    @Query(value = "SELECT * FROM hr_questions WHERE category = :category ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<HRQuestion> findRandomByCategory(String category, int limit);
}
