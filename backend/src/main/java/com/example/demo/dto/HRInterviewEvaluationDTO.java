package com.example.demo.dto;

import lombok.Data;
import java.util.Map;

@Data
public class HRInterviewEvaluationDTO {
    private String category;
    private Map<Long, AnswerDetails> answers;

    @Data
    public static class AnswerDetails {
        private int audioTime;
        private String transcript;
        private int wordCount;
        private int wpm;
        private int fillerCount;
        private String summary;
        private String funFact;
    }
}
