package com.example.demo.dto;

import lombok.Data;

@Data
public class QuestionRequestDTO {
    private Long topicId;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption;
    private String explanation;
    private String difficulty; 
}
