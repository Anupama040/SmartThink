package com.example.demo.service;

import com.example.demo.dto.CodeExecutionResultDTO;
import com.example.demo.dto.CodingProblemDTO;
import com.example.demo.dto.TestCaseDTO;
import com.example.demo.model.CodingAttempt;
import com.example.demo.model.CodingProblem;
import com.example.demo.model.TestCase;
import com.example.demo.model.User;
import com.example.demo.repository.CodingAttemptRepository;
import com.example.demo.repository.CodingProblemRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CodingService {

    private final CodingProblemRepository problemRepository;
    private final CodingAttemptRepository attemptRepository;
    private final UserRepository userRepository;
    private final Judge0ExecutionService executionService;

    public List<CodingProblemDTO> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CodingProblemDTO getProblemById(Long id) {
        return mapToDTO(problemRepository.findById(id).orElseThrow());
    }

    public CodeExecutionResultDTO submitCode(Long userId, Long problemId, String language, String code) {
        User user = userRepository.findById(userId).orElseThrow();
        CodingProblem problem = problemRepository.findById(problemId).orElseThrow();

        // 1. Send code to Judge0 Execution Service (Mocked)
        CodeExecutionResultDTO result = executionService.executeCode(code, language, problem.getTestCases());

        // 2. Save the attempt
        CodingAttempt attempt = CodingAttempt.builder()
                .user(user)
                .problem(problem)
                .codeSubmitted(code)
                .language(language)
                .passedAll(result.isPassed())
                .testCasesPassed(result.getTestCasesPassed())
                .totalTestCases(result.getTotalTestCases())
                .build();
        attemptRepository.save(attempt);

        return result;
    }

    private CodingProblemDTO mapToDTO(CodingProblem p) {
        List<TestCaseDTO> sampleCases = p.getTestCases().stream()
                .filter(tc -> !tc.getIsHidden())
                .map(tc -> TestCaseDTO.builder()
                        .id(tc.getId())
                        .inputData(tc.getInputData())
                        .expectedOutput(tc.getExpectedOutput())
                        .isHidden(tc.getIsHidden())
                        .build())
                .collect(Collectors.toList());

        return CodingProblemDTO.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .difficulty(p.getDifficulty().name())
                .tags(p.getTags())
                .skeletonCodeJava(p.getSkeletonCodeJava())
                .skeletonCodePython(p.getSkeletonCodePython())
                .skeletonCodeCpp(p.getSkeletonCodeCpp())
                .sampleTestCases(sampleCases)
                .build();
    }
}
