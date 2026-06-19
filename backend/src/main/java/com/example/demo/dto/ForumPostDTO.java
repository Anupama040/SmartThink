package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ForumPostDTO {
    private Long id;
    private String title;
    private String content;
    private String tags;
    private Integer upvotes;
    private String authorName;
    private LocalDateTime createdAt;
    private List<ForumCommentDTO> comments;
}
