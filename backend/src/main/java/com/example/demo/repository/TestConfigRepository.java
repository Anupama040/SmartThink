package com.example.demo.repository;

import com.example.demo.model.TestConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestConfigRepository extends JpaRepository<TestConfig, Long> {
}
