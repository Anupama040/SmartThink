package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ForumCommentDTO {
    private Long id;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;
}
