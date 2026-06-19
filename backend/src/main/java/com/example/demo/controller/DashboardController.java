package com.example.demo.controller;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(authentication.getName()));
    }

    @GetMapping("/roadmap")
    public ResponseEntity<com.example.demo.dto.RoadmapDTO> getRoadmap(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getPersonalizedRoadmap(authentication.getName()));
    }
}
