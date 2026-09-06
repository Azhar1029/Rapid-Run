package com.rapidrun.project.service;

import com.rapidrun.project.dto.*;
import com.rapidrun.project.model.*;
import com.rapidrun.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final ProjectFileRepository fileRepo;

    public List<ProjectDto> getAllProjects(String userId) {
        return projectRepo.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public ProjectDto createProject(String userId, CreateProjectRequest req) {
        Project project = Project.builder()
            .name(req.getName()).userId(userId).build();
        return toDto(projectRepo.save(project));
    }

    public ProjectDto renameProject(String userId, String projectId, RenameRequest req) {
        Project project = getOwnedProject(userId, projectId);
        project.setName(req.getName());
        return toDto(projectRepo.save(project));
    }

    @Transactional
    public void deleteProject(String userId, String projectId) {
        Project project = getOwnedProject(userId, projectId);
        projectRepo.delete(project);
    }

    public FileDto createFile(String userId, String projectId, CreateFileRequest req) {
        Project project = getOwnedProject(userId, projectId);
        ProjectFile file = ProjectFile.builder()
            .name(req.getName()).language(req.getLanguage())
            .content("").project(project).build();
        return toFileDto(fileRepo.save(file));
    }

    public FileDto renameFile(String userId, String projectId, String fileId, RenameRequest req) {
        getOwnedProject(userId, projectId);
        ProjectFile file = fileRepo.findByIdAndProjectId(fileId, projectId)
            .orElseThrow(() -> new IllegalArgumentException("File not found"));
        file.setName(req.getName());
        return toFileDto(fileRepo.save(file));
    }

    public FileDto updateFileCode(String userId, String projectId, String fileId, UpdateCodeRequest req) {
        getOwnedProject(userId, projectId);
        ProjectFile file = fileRepo.findByIdAndProjectId(fileId, projectId)
            .orElseThrow(() -> new IllegalArgumentException("File not found"));
        file.setContent(req.getCode() != null ? req.getCode() : "");
        return toFileDto(fileRepo.save(file));
    }

    public void deleteFile(String userId, String projectId, String fileId) {
        getOwnedProject(userId, projectId);
        ProjectFile file = fileRepo.findByIdAndProjectId(fileId, projectId)
            .orElseThrow(() -> new IllegalArgumentException("File not found"));
        fileRepo.delete(file);
    }

    private Project getOwnedProject(String userId, String projectId) {
        return projectRepo.findByIdAndUserId(projectId, userId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
    }

    private ProjectDto toDto(Project p) {
        return ProjectDto.builder()
            .id(p.getId()).name(p.getName()).userId(p.getUserId())
            .files(p.getFiles().stream().map(this::toFileDto).collect(Collectors.toList()))
            .createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt()).build();
    }

    private FileDto toFileDto(ProjectFile f) {
        return FileDto.builder()
            .id(f.getId()).name(f.getName()).language(f.getLanguage())
            .content(f.getContent()).createdAt(f.getCreatedAt()).updatedAt(f.getUpdatedAt()).build();
    }
}
