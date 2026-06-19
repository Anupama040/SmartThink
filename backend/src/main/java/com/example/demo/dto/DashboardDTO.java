package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardDTO {
    private String firstName;
    private String lastName;
    
    // Streaks
    private int practiceStreak;
    private int highestStreak;
    
    // Daily Progress
    private int questionsSolvedToday;
    private double accuracyToday;
    private int timeSpentMinutesToday;
    
    // Resume & Coding (Placeholders for future modules)
    private int resumeAtsMatch;
    private int codingProblemsSolved;
}
