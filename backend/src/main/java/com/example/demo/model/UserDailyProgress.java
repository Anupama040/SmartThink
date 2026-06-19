package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_daily_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class UserDailyProgress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate progressDate;

    private Integer questionsAttempted;
    private Integer questionsCorrect;
    private Integer questionsWrong;
    private Double accuracyPercent;
    private Integer timeSpentMinutes;
    private Integer topicsStudiedCount;
    private Integer learnSessionsCount;
    private Integer practiceSessionsCount;
    private Integer mockTestsCount;
}
