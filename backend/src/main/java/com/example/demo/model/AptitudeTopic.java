package com.example.demo.model;

import com.example.demo.model.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aptitude_topics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class AptitudeTopic extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private AptitudeCategory category;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String formulaNotes;

    @Column(columnDefinition = "TEXT")
    private String shortTricks;

    @Column(columnDefinition = "TEXT")
    private String solvedExamples;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    private Integer displayOrder;

    private Boolean isActive;
}
