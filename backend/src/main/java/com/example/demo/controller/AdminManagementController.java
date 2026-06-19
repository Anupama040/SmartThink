package com.example.demo.controller;

import com.example.demo.model.AptitudeTopic;
import com.example.demo.model.AptitudeCategory;
import com.example.demo.model.enums.CategoryType;
import com.example.demo.model.TestConfig;
import com.example.demo.repository.AptitudeTopicRepository;
import com.example.demo.repository.AptitudeCategoryRepository;
import com.example.demo.repository.AptitudeQuestionRepository;
import com.example.demo.repository.TestConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/management")
public class AdminManagementController {

    @Autowired
    private AptitudeTopicRepository aptitudeTopicRepository;

    @Autowired
    private AptitudeCategoryRepository aptitudeCategoryRepository;

    @Autowired
    private AptitudeQuestionRepository aptitudeQuestionRepository;

    @Autowired
    private TestConfigRepository testConfigRepository;

    @Autowired
    private com.example.demo.repository.ForumPostRepository forumPostRepository;

    @GetMapping("/data")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> getAdminData() {
        Map<String, Object> data = new HashMap<>();

        data.put("users", List.of(
            Map.of("id", 101, "name", "Alex Johnson", "email", "alex@example.com", "role", "STUDENT", "reg", "2026-05-12", "streak", 12, "status", "Active"),
            Map.of("id", 102, "name", "Maria Garcia", "email", "maria@example.com", "role", "STUDENT", "reg", "2026-05-20", "streak", 5, "status", "Active"),
            Map.of("id", 103, "name", "David Smith", "email", "david@example.com", "role", "MODERATOR", "reg", "2026-01-15", "streak", 45, "status", "Active"),
            Map.of("id", 104, "name", "Sarah Connor", "email", "sarah@example.com", "role", "STUDENT", "reg", "2026-06-01", "streak", 0, "status", "Blocked")
        ));

        List<Map<String, Object>> topicsList = aptitudeTopicRepository.findAll().stream().map(topic -> {
            Map<String, Object> t = new HashMap<>();
            t.put("id", topic.getId());
            t.put("name", topic.getName());
            t.put("cat", topic.getCategory().getName().name());
            t.put("questions", aptitudeQuestionRepository.countByTopicId(topic.getId()));
            t.put("status", topic.getIsActive() != null && topic.getIsActive() ? "Published" : "Draft");
            return t;
        }).collect(Collectors.toList());
        data.put("topics", topicsList);

        List<Map<String, Object>> testsList = testConfigRepository.findAll().stream().map(test -> {
            Map<String, Object> t = new HashMap<>();
            t.put("id", test.getId());
            t.put("name", test.getName());
            t.put("time", test.getTotalDurationMinutes() + " mins");
            t.put("marks", test.getTotalMarks());
            t.put("rules", test.isHasNegativeMarking() ? "-" + test.getNegativeMarkWeight() + " Negative Marking" : "No Negative Marking");
            t.put("status", test.isActive() ? "Active" : "Draft");
            return t;
        }).collect(Collectors.toList());
        data.put("tests", testsList);

        List<Map<String, Object>> forumList = forumPostRepository.findByStatus("FLAGGED").stream().map(post -> {
            Map<String, Object> p = new HashMap<>();
            p.put("id", post.getId());
            p.put("author", post.getAuthor().getFirstName() != null ? post.getAuthor().getFirstName() : post.getAuthor().getEmail());
            p.put("flagReason", post.getFlagReason() != null ? post.getFlagReason() : "Community Flag");
            p.put("content", post.getContent());
            p.put("date", post.getCreatedAt() != null ? post.getCreatedAt().toString() : "Recent");
            return p;
        }).collect(Collectors.toList());
        data.put("forum", forumList);

        return data;
    }

    @PostMapping("/topics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTopic(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String catName = payload.get("cat"); 
        
        CategoryType catType;
        switch(catName.toLowerCase()) {
            case "reasoning": catType = CategoryType.LOGICAL_REASONING; break;
            case "verbal": catType = CategoryType.VERBAL_ABILITY; break;
            default: catType = CategoryType.QUANTITATIVE;
        }

        AptitudeCategory category = aptitudeCategoryRepository.findByName(catType).orElseGet(() -> {
            AptitudeCategory newCat = new AptitudeCategory();
            newCat.setName(catType);
            return aptitudeCategoryRepository.save(newCat);
        });

        AptitudeTopic topic = new AptitudeTopic();
        topic.setName(name);
        topic.setCategory(category);
        topic.setIsActive(false);
        aptitudeTopicRepository.save(topic);

        return ResponseEntity.ok(Map.of("message", "Topic created successfully"));
    }

    @PutMapping("/topics/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleTopicStatus(@PathVariable Long id) {
        AptitudeTopic topic = aptitudeTopicRepository.findById(id).orElseThrow();
        topic.setIsActive(!(topic.getIsActive() != null && topic.getIsActive()));
        aptitudeTopicRepository.save(topic);
        return ResponseEntity.ok(Map.of("message", "Topic status toggled successfully"));
    }

    @PostMapping("/tests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTest(@RequestBody Map<String, Object> payload) {
        TestConfig test = new TestConfig();
        test.setName((String) payload.get("name"));
        test.setTotalDurationMinutes(Integer.parseInt(payload.get("time").toString().replace(" mins", "")));
        test.setTotalMarks(Integer.parseInt(payload.get("marks").toString()));
        
        String rules = (String) payload.get("rules");
        if (rules != null && rules.contains("Negative")) {
            test.setHasNegativeMarking(true);
            try {
                test.setNegativeMarkWeight(Double.parseDouble(rules.split(" ")[0].replace("-", "")));
            } catch (Exception e) {
                test.setNegativeMarkWeight(0.25);
            }
        } else {
            test.setHasNegativeMarking(false);
        }
        
        test.setActive(false);
        testConfigRepository.save(test);

        return ResponseEntity.ok(Map.of("message", "Test created successfully"));
    }

    @PutMapping("/tests/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleTestStatus(@PathVariable Long id) {
        TestConfig test = testConfigRepository.findById(id).orElseThrow();
        test.setActive(!test.isActive());
        testConfigRepository.save(test);
        return ResponseEntity.ok(Map.of("message", "Test status toggled successfully"));
    }

    @PutMapping("/forum/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveForumPost(@PathVariable Long id) {
        com.example.demo.model.ForumPost post = forumPostRepository.findById(id).orElseThrow();
        post.setStatus("APPROVED");
        forumPostRepository.save(post);
        return ResponseEntity.ok(Map.of("message", "Post approved"));
    }

    @DeleteMapping("/forum/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteForumPost(@PathVariable Long id) {
        forumPostRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Post deleted"));
    }
}
