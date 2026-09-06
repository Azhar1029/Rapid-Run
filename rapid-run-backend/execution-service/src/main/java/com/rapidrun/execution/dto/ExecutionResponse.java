package com.rapidrun.execution.dto;
import lombok.*;

@Data @AllArgsConstructor @Builder
public class ExecutionResponse {
    private String stdout;
    private String stderr;
    private int exitCode;
    private String elapsed;
}
