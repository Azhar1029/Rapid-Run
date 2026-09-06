package com.rapidrun.execution.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ExecutionRequest {
    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Language is required")
    private String language;

    private String stdin = "";
}
