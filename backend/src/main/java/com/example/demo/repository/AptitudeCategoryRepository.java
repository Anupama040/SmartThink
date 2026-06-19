package com.example.demo.repository;

import com.example.demo.model.AptitudeCategory;
import com.example.demo.model.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AptitudeCategoryRepository extends JpaRepository<AptitudeCategory, Long> {
    Optional<AptitudeCategory> findByName(CategoryType name);
}
