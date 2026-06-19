package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AptitudeTopicDTO {
    private Long id;
    private String name;
    private String description;
    private String difficultyLevel;
    
    // Detailed Learn Mode Content
    private String formulaNotes;
    private String shortTricks;
    private String solvedExamples;
}
