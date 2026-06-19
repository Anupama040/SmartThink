package com.example.demo.repository;

import com.example.demo.model.AptitudeTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AptitudeTopicRepository extends JpaRepository<AptitudeTopic, Long> {
    List<AptitudeTopic> findByCategoryId(Long categoryId);
}
