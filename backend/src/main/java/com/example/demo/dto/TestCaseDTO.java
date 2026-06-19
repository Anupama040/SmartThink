package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestCaseDTO {
    private Long id;
    private String inputData;
    private String expectedOutput;
    private Boolean isHidden;
}
