package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "coding_problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class CodingProblem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private com.example.demo.model.enums.DifficultyLevel difficulty;

    private String tags;

    @Column(columnDefinition = "TEXT")
    private String skeletonCodeJava;

    @Column(columnDefinition = "TEXT")
    private String skeletonCodePython;
    
    @Column(columnDefinition = "TEXT")
    private String skeletonCodeCpp;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestCase> testCases;
}
