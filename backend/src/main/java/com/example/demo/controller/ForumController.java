package com.example.demo.controller;

import com.example.demo.dto.ForumCommentDTO;
import com.example.demo.dto.ForumPostDTO;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ForumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;
    private final UserRepository userRepository;

    @GetMapping("/posts")
    public ResponseEntity<List<ForumPostDTO>> getAllPosts() {
        return ResponseEntity.ok(forumService.getAllPosts());
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPostDTO> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(forumService.getPostById(id));
    }

    @PostMapping("/posts")
    public ResponseEntity<ForumPostDTO> createPost(@RequestBody ForumPostDTO dto, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(forumService.createPost(user.getId(), dto));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ForumCommentDTO> addComment(@PathVariable Long id, @RequestBody Map<String, String> payload, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(forumService.addComment(user.getId(), id, payload.get("content")));
    }

    @PostMapping("/posts/{id}/upvote")
    public ResponseEntity<Void> upvotePost(@PathVariable Long id) {
        forumService.upvotePost(id);
        return ResponseEntity.ok().build();
    }
}
