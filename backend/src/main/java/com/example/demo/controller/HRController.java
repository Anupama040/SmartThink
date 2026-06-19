package com.example.demo.controller;

import com.example.demo.model.HRQuestion;
import com.example.demo.service.HRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
@RequiredArgsConstructor
public class HRController {

    private final HRService hrService;

    @GetMapping("/interview")
    public ResponseEntity<List<HRQuestion>> getInterviewSession(@RequestParam(defaultValue = "BEHAVIORAL") String category) {
        return ResponseEntity.ok(hrService.generateInterview(category));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<?> evaluateInterview(@RequestBody com.example.demo.dto.HRInterviewEvaluationDTO payload, java.security.Principal principal) {
        com.example.demo.model.HRInterviewAttempt attempt = hrService.evaluateInterview(payload, principal.getName());
        return ResponseEntity.ok(attempt);
    }
}
