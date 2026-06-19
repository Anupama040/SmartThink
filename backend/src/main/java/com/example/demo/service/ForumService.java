package com.example.demo.service;

import com.example.demo.dto.ForumCommentDTO;
import com.example.demo.dto.ForumPostDTO;
import com.example.demo.model.ForumComment;
import com.example.demo.model.ForumPost;
import com.example.demo.model.User;
import com.example.demo.repository.ForumCommentRepository;
import com.example.demo.repository.ForumPostRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final ForumPostRepository postRepository;
    private final ForumCommentRepository commentRepository;
    private final UserRepository userRepository;

    public List<ForumPostDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream().map(this::mapToPostDTO).collect(Collectors.toList());
    }

    public ForumPostDTO getPostById(Long id) {
        ForumPost post = postRepository.findById(id).orElseThrow();
        return mapToPostDTO(post);
    }

    @Transactional
    public ForumPostDTO createPost(Long userId, ForumPostDTO dto) {
        User user = userRepository.findById(userId).orElseThrow();
        ForumPost post = ForumPost.builder()
                .author(user)
                .title(dto.getTitle())
                .content(dto.getContent())
                .tags(dto.getTags())
                .upvotes(0)
                .build();
        return mapToPostDTO(postRepository.save(post));
    }

    @Transactional
    public ForumCommentDTO addComment(Long userId, Long postId, String content) {
        User user = userRepository.findById(userId).orElseThrow();
        ForumPost post = postRepository.findById(postId).orElseThrow();

        ForumComment comment = ForumComment.builder()
                .author(user)
                .post(post)
                .content(content)
                .build();
        return mapToCommentDTO(commentRepository.save(comment));
    }

    @Transactional
    public void upvotePost(Long postId) {
        ForumPost post = postRepository.findById(postId).orElseThrow();
        post.setUpvotes(post.getUpvotes() + 1);
        postRepository.save(post);
    }

    private ForumPostDTO mapToPostDTO(ForumPost post) {
        return ForumPostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .tags(post.getTags())
                .upvotes(post.getUpvotes())
                .authorName(post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName())
                .createdAt(post.getCreatedAt())
                .comments(post.getComments() != null ? post.getComments().stream().map(this::mapToCommentDTO).collect(Collectors.toList()) : null)
                .build();
    }

    private ForumCommentDTO mapToCommentDTO(ForumComment comment) {
        return ForumCommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(comment.getAuthor().getFirstName() + " " + comment.getAuthor().getLastName())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
