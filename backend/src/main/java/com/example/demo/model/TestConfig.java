package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class TestConfig extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int totalQuestions;
    private int totalMarks;
    private int totalDurationMinutes;
    private boolean isActive;

    private boolean hasNegativeMarking;
    private double negativeMarkWeight; // e.g. 0.25 for 1/4th negative

    // Blueprint / Mix
    private int easyCount;
    private int mediumCount;
    private int hardCount;

    private int quantCount;
    private int reasoningCount;
    private int verbalCount;

    private boolean randomizeQuestions;
    private boolean randomizeOptions;
    private boolean allowBacktracking;
}
