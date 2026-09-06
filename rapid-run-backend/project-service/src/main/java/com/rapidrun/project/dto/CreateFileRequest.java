package com.rapidrun.project.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateFileRequest {
    @NotBlank(message = "File name is required")
    private String name;

    @NotBlank(message = "Language is required")
    private String language;
}
