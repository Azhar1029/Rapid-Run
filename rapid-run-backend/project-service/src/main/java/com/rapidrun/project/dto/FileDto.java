package com.rapidrun.project.dto;
import lombok.*;
import java.time.LocalDateTime;

@Data @AllArgsConstructor @Builder
public class FileDto {
    private String id;
    private String name;
    private String language;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
