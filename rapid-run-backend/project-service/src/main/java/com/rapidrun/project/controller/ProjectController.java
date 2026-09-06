package com.rapidrun.project.controller;

import com.rapidrun.project.dto.*;
import com.rapidrun.project.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAll(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(projectService.getAllProjects(userId));
    }

    @PostMapping
    public ResponseEntity<ProjectDto> create(@AuthenticationPrincipal String userId,
                                              @Valid @RequestBody CreateProjectRequest req) {
        return ResponseEntity.ok(projectService.createProject(userId, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> rename(@AuthenticationPrincipal String userId,
                                              @PathVariable String id,
                                              @Valid @RequestBody RenameRequest req) {
        return ResponseEntity.ok(projectService.renameProject(userId, id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal String userId,
                                       @PathVariable String id) {
        projectService.deleteProject(userId, id);
        return ResponseEntity.noContent().build();
    }

    // ── File endpoints ──

    @PostMapping("/{projectId}/files")
    public ResponseEntity<FileDto> createFile(@AuthenticationPrincipal String userId,
                                               @PathVariable String projectId,
                                               @Valid @RequestBody CreateFileRequest req) {
        return ResponseEntity.ok(projectService.createFile(userId, projectId, req));
    }

    @PutMapping("/{projectId}/files/{fileId}")
    public ResponseEntity<FileDto> renameFile(@AuthenticationPrincipal String userId,
                                               @PathVariable String projectId,
                                               @PathVariable String fileId,
                                               @Valid @RequestBody RenameRequest req) {
        return ResponseEntity.ok(projectService.renameFile(userId, projectId, fileId, req));
    }

    @PatchMapping("/{projectId}/files/{fileId}/code")
    public ResponseEntity<FileDto> updateCode(@AuthenticationPrincipal String userId,
                                               @PathVariable String projectId,
                                               @PathVariable String fileId,
                                               @RequestBody UpdateCodeRequest req) {
        return ResponseEntity.ok(projectService.updateFileCode(userId, projectId, fileId, req));
    }

    @DeleteMapping("/{projectId}/files/{fileId}")
    public ResponseEntity<Void> deleteFile(@AuthenticationPrincipal String userId,
                                            @PathVariable String projectId,
                                            @PathVariable String fileId) {
        projectService.deleteFile(userId, projectId, fileId);
        return ResponseEntity.noContent().build();
    }
}
