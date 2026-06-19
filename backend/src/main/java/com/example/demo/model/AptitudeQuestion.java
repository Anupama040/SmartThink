package com.example.demo.model;

import com.example.demo.model.enums.DifficultyLevel;
import com.example.demo.model.enums.QuestionMode;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aptitude_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class AptitudeQuestion extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private AptitudeTopic topic;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false)
    private String optionA;

    @Column(nullable = false)
    private String optionB;

    @Column(nullable = false)
    private String optionC;

    @Column(nullable = false)
    private String optionD;

    @Column(nullable = false)
    private String correctOption;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionMode questionType;

    private Integer estimatedTimeSeconds;
    
    @Builder.Default
    @Column(nullable = false, columnDefinition = "integer default 1")
    private Integer marks = 1;

    private Boolean isActive;
}
