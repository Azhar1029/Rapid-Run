package com.rapidrun.execution.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Judge0Response {
    private String stdout;
    private String stderr;
    @JsonProperty("compile_output") private String compileOutput;
    private StatusDto status;
    private String time;

    @Data
    public static class StatusDto {
        private int id;
        private String description;
    }
}
