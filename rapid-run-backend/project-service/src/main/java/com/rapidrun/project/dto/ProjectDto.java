package com.rapidrun.project.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @AllArgsConstructor @Builder
public class ProjectDto {
    private String id;
    private String name;
    private String userId;
    private List<FileDto> files;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
