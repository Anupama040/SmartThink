package com.example.demo.service;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.model.User;
import com.example.demo.model.UserDailyProgress;
import com.example.demo.model.UserStreak;
import com.example.demo.repository.UserDailyProgressRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserStreakRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final UserDailyProgressRepository progressRepository;
    private final UserStreakRepository streakRepository;
    private final com.example.demo.repository.ResumeRepository resumeRepository;

    public DashboardDTO getStudentDashboard(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        LocalDate today = LocalDate.now();

        UserDailyProgress progress = progressRepository.findByUserIdAndProgressDate(user.getId(), today)
                .orElse(null);

        UserStreak streak = streakRepository.findByUserId(user.getId())
                .orElse(null);

        return DashboardDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .practiceStreak(streak != null && streak.getPracticeStreak() != null ? streak.getPracticeStreak() : 0)
                .highestStreak(streak != null && streak.getHighestStreak() != null ? streak.getHighestStreak() : 0)
                .questionsSolvedToday(progress != null && progress.getQuestionsAttempted() != null ? progress.getQuestionsAttempted() : 0)
                .accuracyToday(progress != null && progress.getAccuracyPercent() != null ? progress.getAccuracyPercent() : 0.0)
                .timeSpentMinutesToday(progress != null && progress.getTimeSpentMinutes() != null ? progress.getTimeSpentMinutes() : 0)
                .resumeAtsMatch(resumeRepository.findByUserIdAndIsActiveTrue(user.getId()).map(r -> r.getAtsScore() != null ? r.getAtsScore() : 8).orElse(0))
                .codingProblemsSolved(0) // Phase 3 feature
                .build();
    }
    private final com.example.demo.repository.UserQuestionAttemptRepository attemptRepository;
    private final com.example.demo.repository.AptitudeTopicRepository topicRepository;

    public com.example.demo.dto.RoadmapDTO getPersonalizedRoadmap(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        
        // Dynamic Recommendation Engine based on past mistakes
        java.util.List<com.example.demo.model.UserQuestionAttempt> mistakes = attemptRepository.findByUserIdAndIsCorrectFalse(user.getId());
        
        String recommendedAptitudeTopic = "Profit & Loss"; // Default
        if (!mistakes.isEmpty()) {
            // Find the most failed topic
            java.util.Map<String, Long> topicFailures = mistakes.stream()
                .filter(m -> m.getQuestion() != null && m.getQuestion().getTopic() != null)
                .collect(java.util.stream.Collectors.groupingBy(m -> m.getQuestion().getTopic().getName(), java.util.stream.Collectors.counting()));
            
            recommendedAptitudeTopic = topicFailures.entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse("Profit & Loss");
        }

        return com.example.demo.dto.RoadmapDTO.builder()
                .targetRole("Software Development Engineer")
                .todayTasks(java.util.List.of(
                        com.example.demo.dto.RoadmapItemDTO.builder()
                            .title("Focus on " + recommendedAptitudeTopic)
                            .description("Our AI detected this as a weak area.")
                            .category("Aptitude")
                            .completed(false).build(),
                        com.example.demo.dto.RoadmapItemDTO.builder()
                            .title("Solve Two Sum Algorithm")
                            .description("Practice basic array traversal")
                            .category("Coding")
                            .completed(false).build()
                ))
                .upcomingTasks(java.util.List.of(
                        com.example.demo.dto.RoadmapItemDTO.builder()
                            .title("Mock HR Interview")
                            .description("Practice situational questions")
                            .category("Interview")
                            .completed(false).build()
                ))
                .build();
    }
}
