package com.example.demo.controller;

import com.example.demo.dto.QuestionRequestDTO;
import com.example.demo.model.AptitudeQuestion;
import com.example.demo.service.AptitudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAptitudeController {

    private final AptitudeService aptitudeService;

    @PostMapping("/questions")
    public ResponseEntity<AptitudeQuestion> addQuestion(@RequestBody QuestionRequestDTO requestDTO) {
        return ResponseEntity.ok(aptitudeService.addQuestion(requestDTO));
    }
}
