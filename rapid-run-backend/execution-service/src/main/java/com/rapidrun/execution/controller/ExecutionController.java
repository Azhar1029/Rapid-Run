package com.rapidrun.execution.controller;

import com.rapidrun.execution.dto.*;
import com.rapidrun.execution.service.ExecutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
@RequiredArgsConstructor
public class ExecutionController {

    private final ExecutionService executionService;

    @PostMapping
    public ResponseEntity<ExecutionResponse> execute(@Valid @RequestBody ExecutionRequest req) {
        return ResponseEntity.ok(executionService.execute(req));
    }
}
