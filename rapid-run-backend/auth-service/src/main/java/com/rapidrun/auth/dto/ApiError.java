package com.rapidrun.auth.dto;
import lombok.*;
import java.time.LocalDateTime;

@Data @AllArgsConstructor @Builder
public class ApiError {
    private int status;
    private String message;
    private LocalDateTime timestamp;
}
