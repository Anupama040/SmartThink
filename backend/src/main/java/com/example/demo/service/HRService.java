package com.example.demo.service;

import com.example.demo.model.HRQuestion;
import com.example.demo.model.HRInterviewAttempt;
import com.example.demo.model.User;
import com.example.demo.dto.HRInterviewEvaluationDTO;
import com.example.demo.repository.HRQuestionRepository;
import com.example.demo.repository.HRInterviewAttemptRepository;
import com.example.demo.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HRService {

    private final HRQuestionRepository hrQuestionRepository;
    private final HRInterviewAttemptRepository attemptRepository;
    private final UserRepository userRepository;

    @PostConstruct
    public void initDummyQuestions() {
        if (hrQuestionRepository.count() == 0) {
            hrQuestionRepository.saveAll(Arrays.asList(
                HRQuestion.builder()
                    .category("BEHAVIORAL")
                    .questionText("Tell me about a time you had a conflict with a team member and how you resolved it.")
                    .expectedPoints("Use STAR method. Show empathy, active listening, and a collaborative resolution. Do not blame others.")
                    .build(),
                HRQuestion.builder()
                    .category("BEHAVIORAL")
                    .questionText("Describe a situation where you had to meet a tight deadline.")
                    .expectedPoints("Highlight prioritization, time management, and staying calm under pressure.")
                    .build(),
                HRQuestion.builder()
                    .category("MANAGERIAL")
                    .questionText("Where do you see yourself in 5 years?")
                    .expectedPoints("Align your career goals with the company's trajectory. Show ambition but realism.")
                    .build(),
                HRQuestion.builder()
                    .category("MANAGERIAL")
                    .questionText("Why should we hire you over other candidates?")
                    .expectedPoints("Connect your unique skills to the job description. Show enthusiasm and cultural fit.")
                    .build(),
                HRQuestion.builder()
                    .category("SITUATIONAL")
                    .questionText("What would you do if you realized you made a significant mistake on a project?")
                    .expectedPoints("Admit the mistake immediately, propose a solution, and explain how you'll prevent it in the future.")
                    .build()
            ));
        }
    }

    public List<HRQuestion> generateInterview(String category) {
        return hrQuestionRepository.findRandomByCategory(category.toUpperCase(), 3);
    }

    public HRInterviewAttempt evaluateInterview(HRInterviewEvaluationDTO payload, String username) {
        User user = userRepository.findByEmail(username).orElseThrow();
        
        int totalWpm = 0;
        int totalFiller = 0;
        int answerCount = payload.getAnswers().size();
        
        StringBuilder combinedSummary = new StringBuilder();

        for (Map.Entry<Long, HRInterviewEvaluationDTO.AnswerDetails> entry : payload.getAnswers().entrySet()) {
            HRInterviewEvaluationDTO.AnswerDetails details = entry.getValue();
            totalWpm += details.getWpm();
            totalFiller += details.getFillerCount();
            combinedSummary.append(details.getSummary()).append(" ");
        }
        
        int avgWpm = answerCount > 0 ? totalWpm / answerCount : 0;
        
        // Simple scoring logic based on WPM (ideal 110-150) and low filler words
        int communicationScore = 100;
        if (avgWpm < 100 || avgWpm > 160) communicationScore -= 15;
        communicationScore -= (totalFiller * 5); // penalize 5 points per filler
        if (communicationScore < 0) communicationScore = 0;
        
        int overallScore = (communicationScore * 8 + 200) / 10; // weighted score

        HRInterviewAttempt attempt = HRInterviewAttempt.builder()
                .user(user)
                .category(payload.getCategory())
                .avgWpm(avgWpm)
                .totalFillerWords(totalFiller)
                .communicationScore(communicationScore)
                .overallScore(overallScore)
                .summary(combinedSummary.toString().trim())
                .build();
                
        return attemptRepository.save(attempt);
    }
}
