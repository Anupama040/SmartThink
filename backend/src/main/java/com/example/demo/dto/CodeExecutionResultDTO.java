package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CodeExecutionResultDTO {
    private boolean passed;
    private String status; // e.g., "Accepted", "Wrong Answer", "Compilation Error"
    private String output;
    private String expectedOutput;
    private Integer testCasesPassed;
    private Integer totalTestCases;
    private String executionTimeMs;
}
