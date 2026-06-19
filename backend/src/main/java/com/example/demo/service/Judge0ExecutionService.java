package com.example.demo.service;

import com.example.demo.dto.CodeExecutionResultDTO;
import com.example.demo.model.TestCase;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class Judge0ExecutionService {

    // Mock execution service mimicking Judge0 compiler outputs
    // We avoid actual HTTP calls to rapidapi to prevent rate-limiting and missing API key issues for the user.

    public CodeExecutionResultDTO executeCode(String code, String language, List<TestCase> testCases) {
        if (code == null || code.trim().isEmpty()) {
            return CodeExecutionResultDTO.builder()
                    .passed(false)
                    .status("Compilation Error")
                    .output("Syntax Error: Code is empty.")
                    .testCasesPassed(0)
                    .totalTestCases(testCases.size())
                    .executionTimeMs("0ms")
                    .build();
        }

        // Extremely basic syntax check mocking
        if (!code.contains("class") && !code.contains("def ") && !code.contains("public")) {
             return CodeExecutionResultDTO.builder()
                    .passed(false)
                    .status("Compilation Error")
                    .output("Syntax Error: Missing class or method definition.")
                    .testCasesPassed(0)
                    .totalTestCases(testCases.size())
                    .executionTimeMs("12ms")
                    .build();
        }

        // Mock test execution: If code contains "return", we pretend it passes some test cases
        int passedCount = 0;
        String mockOutput = "";
        String expectedForFailed = "";
        boolean allPassed = true;

        for (TestCase tc : testCases) {
            // Very naive simulation: assume if they wrote somewhat reasonable code, they pass.
            // If they just submitted the exact skeleton, we fail them.
            if (code.contains("return 0;") && code.contains("TODO")) {
                allPassed = false;
                mockOutput = "0"; // Mock output from skeleton
                expectedForFailed = tc.getExpectedOutput();
                break;
            } else {
                passedCount++;
            }
        }

        if (allPassed) {
             return CodeExecutionResultDTO.builder()
                    .passed(true)
                    .status("Accepted")
                    .output("All Test Cases Passed.")
                    .testCasesPassed(passedCount)
                    .totalTestCases(testCases.size())
                    .executionTimeMs(String.valueOf(10 + (Math.random() * 20)) + "ms")
                    .build();
        } else {
            return CodeExecutionResultDTO.builder()
                    .passed(false)
                    .status("Wrong Answer")
                    .output(mockOutput)
                    .expectedOutput(expectedForFailed)
                    .testCasesPassed(passedCount)
                    .totalTestCases(testCases.size())
                    .executionTimeMs("15ms")
                    .build();
        }
    }
}
