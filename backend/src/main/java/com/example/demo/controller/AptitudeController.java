package com.example.demo.controller;

import com.example.demo.dto.AptitudeCategoryDTO;
import com.example.demo.dto.AptitudeTopicDTO;
import com.example.demo.model.AptitudeQuestion;
import com.example.demo.model.User;
import com.example.demo.model.enums.QuestionMode;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AptitudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aptitude")
@RequiredArgsConstructor
public class AptitudeController {

    private final AptitudeService aptitudeService;
    private final com.example.demo.service.MockTestService mockTestService;
    private final UserRepository userRepository;

    @GetMapping("/hub")
    public ResponseEntity<List<AptitudeCategoryDTO>> getHubData() {
        return ResponseEntity.ok(aptitudeService.getAllCategoriesWithTopics());
    }

    @GetMapping("/topics/{topicId}/learn")
    public ResponseEntity<AptitudeTopicDTO> getTopicLearnContent(@PathVariable Long topicId) {
        return ResponseEntity.ok(aptitudeService.getTopicLearnContent(topicId));
    }

    @GetMapping("/topics/{topicId}/practice")
    public ResponseEntity<List<AptitudeQuestion>> getTopicPracticeQuestions(@PathVariable Long topicId) {
        return ResponseEntity.ok(aptitudeService.getQuestionsForTopic(topicId));
    }

    @GetMapping("/topics/{topicId}/adaptive-practice")
    public ResponseEntity<List<AptitudeQuestion>> getAdaptivePracticeQuestions(@PathVariable Long topicId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(aptitudeService.getAdaptiveQuestionsForTopic(topicId, user.getId()));
    }

    @GetMapping("/questions")
    public ResponseEntity<List<AptitudeQuestion>> getAllQuestions() {
        return ResponseEntity.ok(aptitudeService.getQuestions());
    }

    @GetMapping("/mock")
    public ResponseEntity<Map<String, Object>> getMockTest() {
        com.example.demo.model.TestConfig config = mockTestService.createDefaultIndiaBixBlueprint();
        List<AptitudeQuestion> questions = mockTestService.generateMockTest(config.getId());
        return ResponseEntity.ok(Map.of(
            "config", config,
            "questions", questions
        ));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(@RequestBody Map<Long, String> answers, @RequestParam(defaultValue = "PRACTICE_ONLY") String mode, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        QuestionMode questionMode = QuestionMode.valueOf(mode);
        return ResponseEntity.ok(aptitudeService.submitTest(user.getId(), answers, questionMode));
    }

    @GetMapping("/analytics/mistakes")
    public ResponseEntity<Map<String, Object>> getMistakeAnalytics(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(aptitudeService.getMistakeLogAnalytics(user.getId()));
    }
}
