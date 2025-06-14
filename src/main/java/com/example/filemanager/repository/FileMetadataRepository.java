package com.example.filemanager.repository;

import com.example.filemanager.model.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    FileMetadata findByFilename(String filename);
}
