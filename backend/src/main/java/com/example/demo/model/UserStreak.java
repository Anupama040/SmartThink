package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_streaks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class UserStreak extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Integer learningStreak;
    private Integer practiceStreak;
    private Integer combinedStreak;
    private Integer highestStreak;
    private Integer freezeCount;

    private LocalDate lastActivityDate;
    private LocalDate lastLearningDate;
    private LocalDate lastPracticeDate;
}
