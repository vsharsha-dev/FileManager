package com.example.filemanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class FileMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String originalFilename;
    private String fileType;
    private Long size;
    private String storagePath;
    private LocalDateTime uploadTime;
}
