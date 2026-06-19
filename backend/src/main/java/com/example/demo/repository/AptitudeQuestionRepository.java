package com.example.demo.repository;

import com.example.demo.model.AptitudeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AptitudeQuestionRepository extends JpaRepository<AptitudeQuestion, Long> {
    List<AptitudeQuestion> findByTopicId(Long topicId);
    int countByTopicId(Long topicId);

    @Query(value = "SELECT q.* FROM aptitude_questions q JOIN aptitude_topics t ON q.topic_id = t.id JOIN aptitude_categories c ON t.category_id = c.id WHERE c.name = :categoryName AND q.difficulty = :difficulty ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<AptitudeQuestion> findRandomQuestionsByCategoryAndDifficulty(@Param("categoryName") String categoryName, @Param("difficulty") String difficulty, @Param("limit") int limit);
}
