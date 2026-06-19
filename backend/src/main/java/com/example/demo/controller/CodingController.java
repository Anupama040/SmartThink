package com.example.demo.controller;

import com.example.demo.dto.CodeExecutionResultDTO;
import com.example.demo.dto.CodingProblemDTO;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CodingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coding")
@RequiredArgsConstructor
public class CodingController {

    private final CodingService codingService;
    private final UserRepository userRepository;

    @GetMapping("/problems")
    public ResponseEntity<List<CodingProblemDTO>> getAllProblems() {
        return ResponseEntity.ok(codingService.getAllProblems());
    }

    @GetMapping("/problems/{id}")
    public ResponseEntity<CodingProblemDTO> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(codingService.getProblemById(id));
    }

    @PostMapping("/problems/{id}/submit")
    public ResponseEntity<CodeExecutionResultDTO> submitCode(@PathVariable Long id, @RequestBody Map<String, String> payload, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        String code = payload.get("code");
        String language = payload.get("language");
        return ResponseEntity.ok(codingService.submitCode(user.getId(), id, language, code));
    }
}
