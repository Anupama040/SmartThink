package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CodingProblemDTO {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String tags;
    private String skeletonCodeJava;
    private String skeletonCodePython;
    private String skeletonCodeCpp;
    private List<TestCaseDTO> sampleTestCases;
}
