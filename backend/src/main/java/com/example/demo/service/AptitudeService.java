package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.model.*;
import com.example.demo.model.enums.QuestionMode;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AptitudeService {

    private final AptitudeCategoryRepository categoryRepository;
    private final AptitudeTopicRepository topicRepository;
    private final AptitudeQuestionRepository questionRepository;
    private final UserQuestionAttemptRepository attemptRepository;
    private final UserDailyProgressRepository progressRepository;
    private final UserStreakRepository streakRepository;
    private final UserRepository userRepository;

    public List<AptitudeCategoryDTO> getAllCategoriesWithTopics() {
        return categoryRepository.findAll().stream().map(cat -> 
            AptitudeCategoryDTO.builder()
                .id(cat.getId())
                .name(cat.getName().name())
                .description(cat.getDescription())
                .topics(topicRepository.findByCategoryId(cat.getId()).stream().map(top ->
                    AptitudeTopicDTO.builder()
                        .id(top.getId())
                        .name(top.getName())
                        .description(top.getDescription())
                        .difficultyLevel(top.getDifficultyLevel() != null ? top.getDifficultyLevel().name() : "EASY")
                        .build()
                ).collect(Collectors.toList()))
                .build()
        ).collect(Collectors.toList());
    }

    public AptitudeTopicDTO getTopicLearnContent(Long topicId) {
        AptitudeTopic top = topicRepository.findById(topicId).orElseThrow();
        return AptitudeTopicDTO.builder()
                .id(top.getId())
                .name(top.getName())
                .description(top.getDescription())
                .formulaNotes(top.getFormulaNotes())
                .shortTricks(top.getShortTricks())
                .solvedExamples(top.getSolvedExamples())
                .build();
    }

    public List<AptitudeQuestion> getQuestionsForTopic(Long topicId) {
        return questionRepository.findByTopicId(topicId);
    }

    public List<AptitudeQuestion> getAdaptiveQuestionsForTopic(Long topicId, Long userId) {
        // 1. Fetch user's past attempts for this topic
        List<UserQuestionAttempt> attempts = attemptRepository.findByUserIdAndIsCorrectFalse(userId).stream()
            .filter(a -> a.getTopic() != null && a.getTopic().getId().equals(topicId))
            .collect(Collectors.toList());
            
        List<UserQuestionAttempt> allAttempts = attemptRepository.findAll().stream()
            .filter(a -> a.getUser().getId().equals(userId) && a.getTopic() != null && a.getTopic().getId().equals(topicId))
            .collect(Collectors.toList());

        // 2. Calculate accuracy for this topic
        double accuracy = 0.0;
        if (!allAttempts.isEmpty()) {
            long correct = allAttempts.stream().filter(UserQuestionAttempt::getIsCorrect).count();
            accuracy = (correct * 100.0) / allAttempts.size();
        } else {
            accuracy = 50.0; // Default if no history
        }

        // 3. Determine target difficulty
        com.example.demo.model.enums.DifficultyLevel targetDifficulty = com.example.demo.model.enums.DifficultyLevel.EASY;
        if (accuracy > 75.0) targetDifficulty = com.example.demo.model.enums.DifficultyLevel.HARD;
        else if (accuracy > 40.0) targetDifficulty = com.example.demo.model.enums.DifficultyLevel.MEDIUM;

        // 4. Fetch questions matching target difficulty
        com.example.demo.model.enums.DifficultyLevel finalTargetDifficulty = targetDifficulty;
        List<AptitudeQuestion> targetQuestions = questionRepository.findByTopicId(topicId).stream()
            .filter(q -> q.getDifficulty() == finalTargetDifficulty)
            .collect(Collectors.toList());

        // If not enough questions of that difficulty, just return all
        if (targetQuestions.isEmpty()) {
            return questionRepository.findByTopicId(topicId);
        }
        
        return targetQuestions;
    }

    public List<AptitudeQuestion> getQuestions() {
        return questionRepository.findAll();
    }

    public AptitudeQuestion addQuestion(QuestionRequestDTO dto) {
        AptitudeTopic topic = topicRepository.findById(dto.getTopicId()).orElseThrow();
        
        AptitudeQuestion q = AptitudeQuestion.builder()
                .topic(topic)
                .questionText(dto.getQuestionText())
                .optionA(dto.getOptionA())
                .optionB(dto.getOptionB())
                .optionC(dto.getOptionC())
                .optionD(dto.getOptionD())
                .correctOption(dto.getCorrectOption())
                .explanation(dto.getExplanation())
                .difficulty(com.example.demo.model.enums.DifficultyLevel.valueOf(dto.getDifficulty()))
                .questionType(QuestionMode.PRACTICE_ONLY)
                .isActive(true)
                .build();
                
        return questionRepository.save(q);
    }

    @Transactional
    public Map<String, Object> submitTest(Long userId, Map<Long, String> answers, QuestionMode mode) {
        User user = userRepository.findById(userId).orElseThrow();
        int score = 0;
        int maxPossibleScore = 0;
        int timeTaken = 60; 
        
        List<AptitudeQuestion> questions = questionRepository.findAllById(answers.keySet());
        
        for (AptitudeQuestion q : questions) {
            String selected = answers.get(q.getId());
            boolean isCorrect = q.getCorrectOption().equalsIgnoreCase(selected);
            
            int weight = 1;
            if (q.getDifficulty() == com.example.demo.model.enums.DifficultyLevel.MEDIUM) weight = 2;
            if (q.getDifficulty() == com.example.demo.model.enums.DifficultyLevel.HARD) weight = 3;
            
            maxPossibleScore += weight;
            
            double scoreAwarded = 0;
            String errorType = null;
            
            if (isCorrect) {
                score += weight;
                scoreAwarded = weight;
            } else if (selected != null && !selected.isEmpty()) {
                if (mode == QuestionMode.MOCK) {
                    double penalty = weight * 0.25;
                    score -= penalty;
                    scoreAwarded = -penalty;
                }
                
                // Categorize Mistake
                if (q.getDifficulty() == com.example.demo.model.enums.DifficultyLevel.EASY) {
                    errorType = "CARELESS";
                } else if (q.getDifficulty() == com.example.demo.model.enums.DifficultyLevel.HARD) {
                    errorType = "CONCEPTUAL";
                } else {
                    errorType = "TIME_PRESSURE";
                }
            }

            attemptRepository.save(UserQuestionAttempt.builder()
                    .user(user)
                    .question(q)
                    .topic(q.getTopic())
                    .attemptDateTime(LocalDateTime.now())
                    .selectedOption(selected)
                    .isCorrect(isCorrect)
                    .timeTakenSeconds(timeTaken)
                    .mode(mode)
                    .scoreAwarded((int) Math.round(scoreAwarded))
                    .errorType(errorType)
                    .build());
        }
        
        // Use answers.size() for analytics, as score is now weighted
        int correctCount = (int) questions.stream().filter(q -> q.getCorrectOption().equalsIgnoreCase(answers.get(q.getId()))).count();
        updateDailyProgressAndStreak(user, answers.size(), correctCount, answers.size() - correctCount, timeTaken * answers.size());

        return Map.of(
                "totalQuestions", answers.size(),
                "score", score,
                "maxPossibleScore", maxPossibleScore,
                "percentage", maxPossibleScore > 0 ? (score * 100.0 / maxPossibleScore) : 0
        );
    }

    public Map<String, Object> getMistakeLogAnalytics(Long userId) {
        List<UserQuestionAttempt> mistakes = attemptRepository.findByUserIdAndIsCorrectFalse(userId)
                .stream().filter(m -> m.getErrorType() != null).collect(Collectors.toList());
        
        long careless = mistakes.stream().filter(m -> "CARELESS".equals(m.getErrorType())).count();
        long conceptual = mistakes.stream().filter(m -> "CONCEPTUAL".equals(m.getErrorType())).count();
        long timePressure = mistakes.stream().filter(m -> "TIME_PRESSURE".equals(m.getErrorType())).count();

        return Map.of(
            "totalMistakes", mistakes.size(),
            "carelessCount", careless,
            "conceptualCount", conceptual,
            "timePressureCount", timePressure
        );
    }

    private void updateDailyProgressAndStreak(User user, int attempted, int correct, int wrong, int timeSpent) {
        LocalDate today = LocalDate.now();
        
        UserDailyProgress progress = progressRepository.findByUserIdAndProgressDate(user.getId(), today)
                .orElse(UserDailyProgress.builder()
                        .user(user)
                        .progressDate(today)
                        .questionsAttempted(0)
                        .questionsCorrect(0)
                        .questionsWrong(0)
                        .accuracyPercent(0.0)
                        .timeSpentMinutes(0)
                        .topicsStudiedCount(0)
                        .learnSessionsCount(0)
                        .practiceSessionsCount(0)
                        .mockTestsCount(0)
                        .build());
        
        progress.setQuestionsAttempted(progress.getQuestionsAttempted() + attempted);
        progress.setQuestionsCorrect(progress.getQuestionsCorrect() + correct);
        progress.setQuestionsWrong(progress.getQuestionsWrong() + wrong);
        progress.setTimeSpentMinutes(progress.getTimeSpentMinutes() + (timeSpent / 60));
        progress.setPracticeSessionsCount(progress.getPracticeSessionsCount() + 1);
        if (progress.getQuestionsAttempted() > 0) {
            progress.setAccuracyPercent((progress.getQuestionsCorrect() * 100.0) / progress.getQuestionsAttempted());
        }
        progressRepository.save(progress);

        UserStreak streak = streakRepository.findByUserId(user.getId())
                .orElse(UserStreak.builder()
                        .user(user)
                        .learningStreak(0)
                        .practiceStreak(0)
                        .combinedStreak(0)
                        .highestStreak(0)
                        .freezeCount(1)
                        .build());

        if (streak.getLastPracticeDate() == null || !streak.getLastPracticeDate().equals(today)) {
            if (streak.getLastPracticeDate() != null && streak.getLastPracticeDate().equals(today.minusDays(1))) {
                streak.setPracticeStreak(streak.getPracticeStreak() + 1);
            } else if (streak.getLastPracticeDate() == null || streak.getLastPracticeDate().isBefore(today.minusDays(1))) {
                streak.setPracticeStreak(1); 
            }
            streak.setLastPracticeDate(today);
            streak.setLastActivityDate(today);
            if (streak.getPracticeStreak() > streak.getHighestStreak()) {
                streak.setHighestStreak(streak.getPracticeStreak());
            }
            streakRepository.save(streak);
        }
    }
}
