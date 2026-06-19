package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminAnalyticsDTO {
    private long totalUsers;
    private long totalQuestions;
    private long totalAttempts;
    private double overallAccuracy;
    private long activeResumes;
    private long totalForumPosts;
    private java.util.List<Integer> usageTrends;
    private java.util.List<java.util.Map<String, String>> topCandidates;
}
