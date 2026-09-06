package com.rapidrun.project.repository;
import com.rapidrun.project.model.ProjectFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProjectFileRepository extends JpaRepository<ProjectFile, String> {
    Optional<ProjectFile> findByIdAndProjectId(String id, String projectId);
}
