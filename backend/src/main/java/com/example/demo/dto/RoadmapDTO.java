package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class RoadmapDTO {
    private String targetRole;
    private List<RoadmapItemDTO> todayTasks;
    private List<RoadmapItemDTO> upcomingTasks;
}
