package com.example.demo.service;

import com.example.demo.model.Resume;
import com.example.demo.model.User;
import com.example.demo.repository.ResumeRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    // Strict 5MB limit
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    @Transactional
    public Resume uploadResume(Long userId, MultipartFile file) throws IOException {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit.");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf") 
                && !contentType.equals("application/msword") 
                && !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
            throw new IllegalArgumentException("Only PDF, DOC, or DOCX files are allowed.");
        }

        User user = userRepository.findById(userId).orElseThrow();

        // Archive old active resume
        resumeRepository.findByUserIdAndIsActiveTrue(userId).ifPresent(oldResume -> {
            oldResume.setIsActive(false);
            resumeRepository.save(oldResume);
        });

        // Upload locally
        String url = fileStorageService.storeFile(file);

        // Parse PDF for basic ATS Score
        int atsScore = 0;
        String extractedSkills = "";
        String feedback = "";

        if ("application/pdf".equals(contentType)) {
            try (PDDocument document = PDDocument.load(file.getInputStream())) {
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(document).toLowerCase();
                
                // Extremely basic parsing heuristics
                int score = 4; // Base score for being a valid PDF under 5MB
                
                // Check Contact Info
                if (text.contains("@") && (text.contains("linkedin") || text.contains("github") || text.matches(".*\\d{10}.*"))) {
                    score += 2;
                } else {
                    feedback += "Missing email or contact links. ";
                }

                // Check sections
                if (text.contains("education") || text.contains("university")) score += 1;
                if (text.contains("experience") || text.contains("projects")) score += 1;
                
                // Basic Skill Extraction
                List<String> commonSkills = Arrays.asList("java", "python", "react", "spring", "sql", "javascript", "c++", "html", "css", "docker", "aws", "git");
                List<String> foundSkills = commonSkills.stream().filter(text::contains).collect(Collectors.toList());
                
                if (!foundSkills.isEmpty()) {
                    score += 2;
                    extractedSkills = String.join(", ", foundSkills);
                } else {
                    feedback += "No core technical skills detected. ";
                }

                atsScore = Math.min(score, 10);
                if (atsScore == 10) feedback = "Excellent ATS format!";
            } catch (Exception e) {
                feedback = "Failed to parse PDF content.";
            }
        } else {
            atsScore = 5; // Default for DOCX since we aren't parsing it yet
            feedback = "DOCX uploaded. Please upload PDF for deep ATS scan.";
        }

        Resume resume = Resume.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .fileUrl(url)
                .fileType(contentType)
                .fileSizeKb(file.getSize() / 1024)
                .isActive(true)
                .atsScore(atsScore)
                .skillsExtracted(extractedSkills)
                .atsFeedback(feedback)
                .build();

        return resumeRepository.save(resume);
    }

    public Resume getActiveResume(Long userId) {
        return resumeRepository.findByUserIdAndIsActiveTrue(userId).orElse(null);
    }

    public List<Resume> getResumeHistory(Long userId) {
        return resumeRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
