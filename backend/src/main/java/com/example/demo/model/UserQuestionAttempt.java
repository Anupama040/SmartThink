package com.example.demo.model;

import com.example.demo.model.enums.QuestionMode;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_question_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class UserQuestionAttempt extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private AptitudeQuestion question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private AptitudeTopic topic;

    @Column(nullable = false)
    private LocalDateTime attemptDateTime;

    private String selectedOption;

    @Column(nullable = false)
    private Boolean isCorrect;

    private Integer timeTakenSeconds;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionMode mode;

    private Integer scoreAwarded;
    
    private String errorType; // "CARELESS", "CONCEPTUAL", "TIME_PRESSURE"
}
