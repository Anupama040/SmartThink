package com.example.demo.service;

import com.example.demo.model.AptitudeQuestion;
import com.example.demo.model.TestConfig;
import com.example.demo.repository.AptitudeQuestionRepository;
import com.example.demo.repository.TestConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MockTestService {

    private final AptitudeQuestionRepository questionRepository;
    private final TestConfigRepository testConfigRepository;

    public List<AptitudeQuestion> generateMockTest(Long configId) {
        TestConfig config = testConfigRepository.findById(configId)
                .orElseThrow(() -> new RuntimeException("Test config not found"));

        List<AptitudeQuestion> paper = new ArrayList<>();

        // Generate Quantitative Section
        if (config.getQuantCount() > 0) {
            paper.addAll(fetchSectionQuestions("QUANTITATIVE", config.getQuantCount(), config.getEasyCount(), config.getMediumCount(), config.getHardCount()));
        }

        // Generate Logical Section
        if (config.getReasoningCount() > 0) {
            paper.addAll(fetchSectionQuestions("LOGICAL_REASONING", config.getReasoningCount(), config.getEasyCount(), config.getMediumCount(), config.getHardCount()));
        }

        // Generate Verbal Section
        if (config.getVerbalCount() > 0) {
            paper.addAll(fetchSectionQuestions("VERBAL_ABILITY", config.getVerbalCount(), config.getEasyCount(), config.getMediumCount(), config.getHardCount()));
        }

        if (config.isRandomizeQuestions()) {
            Collections.shuffle(paper);
        }

        return paper;
    }

    private List<AptitudeQuestion> fetchSectionQuestions(String categoryName, int totalCount, int easyRatio, int mediumRatio, int hardRatio) {
        List<AptitudeQuestion> section = new ArrayList<>();
        
        int totalRatio = easyRatio + mediumRatio + hardRatio;
        if (totalRatio == 0) return section;

        int easyNeeded = (int) Math.round((double) easyRatio / totalRatio * totalCount);
        int mediumNeeded = (int) Math.round((double) mediumRatio / totalRatio * totalCount);
        int hardNeeded = totalCount - easyNeeded - mediumNeeded;

        section.addAll(questionRepository.findRandomQuestionsByCategoryAndDifficulty(categoryName, "EASY", easyNeeded));
        section.addAll(questionRepository.findRandomQuestionsByCategoryAndDifficulty(categoryName, "MEDIUM", mediumNeeded));
        section.addAll(questionRepository.findRandomQuestionsByCategoryAndDifficulty(categoryName, "HARD", hardNeeded));

        return section;
    }

    public TestConfig createDefaultIndiaBixBlueprint() {
        if (testConfigRepository.count() > 0) {
            return testConfigRepository.findAll().get(0);
        }
        TestConfig config = TestConfig.builder()
                .name("IndiaBix Standard Mock")
                .description("A high-fidelity placement simulation.")
                .totalQuestions(30)
                .totalDurationMinutes(40)
                .hasNegativeMarking(true)
                .negativeMarkWeight(0.25)
                .quantCount(10)
                .reasoningCount(10)
                .verbalCount(10)
                .easyCount(5)
                .mediumCount(3)
                .hardCount(2)
                .randomizeQuestions(true)
                .randomizeOptions(true)
                .allowBacktracking(true)
                .build();
        return testConfigRepository.save(config);
    }
}
