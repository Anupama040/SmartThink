package com.example.demo.controller;

import com.example.demo.model.Resume;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
            Resume resume = resumeService.uploadResume(user.getId(), file);
            return ResponseEntity.ok(resume);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload resume.");
        }
    }

    @GetMapping("/active")
    public ResponseEntity<Resume> getActiveResume(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Resume resume = resumeService.getActiveResume(user.getId());
        return resume != null ? ResponseEntity.ok(resume) : ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<Resume>> getResumeHistory(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(resumeService.getResumeHistory(user.getId()));
    }
}
