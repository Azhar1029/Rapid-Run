package com.rapidrun.execution.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data @AllArgsConstructor @Builder
public class Judge0Request {
    @JsonProperty("source_code") private String sourceCode;
    @JsonProperty("language_id") private int languageId;
    private String stdin;
}
