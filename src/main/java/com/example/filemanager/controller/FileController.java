package com.example.filemanager.controller;

import com.example.filemanager.model.FileMetadata;
import com.example.filemanager.service.FileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*")
public class FileController {
    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            logger.error("Failed to upload empty file");
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        try {
            FileMetadata metadata = fileService.saveFile(file);
            logger.info("File uploaded successfully: {}", metadata.getFilename());
            return ResponseEntity.ok(metadata);
        } catch (IOException e) {
            logger.error("Error uploading file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<FileMetadata>> listFiles() {
        try {
            List<FileMetadata> files = fileService.listFiles();
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            logger.error("Error listing files: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = fileService.getFile(filename);
            if (filePath == null || !Files.exists(filePath)) {
                logger.error("File not found: {}", filename);
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                logger.error("File is not readable: {}", filename);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .header(HttpHeaders.PRAGMA, "no-cache")
                    .header(HttpHeaders.EXPIRES, "0")
                    .body(resource);
        } catch (IOException e) {
            logger.error("Error downloading file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/preview/{filename:.+}")
    public ResponseEntity<Resource> previewFile(@PathVariable String filename) {
        try {
            Path filePath = fileService.getFile(filename);
            if (filePath == null || !Files.exists(filePath)) {
                logger.error("File not found: {}", filename);
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                logger.error("File is not readable: {}", filename);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // For text files, return the content directly
            if (contentType.startsWith("text/") || contentType.equals("application/json")) {
                String content = new String(Files.readAllBytes(filePath));
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(new org.springframework.core.io.ByteArrayResource(content.getBytes()));
            }

            // For images, return them inline
            if (contentType.startsWith("image/")) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            }

            // For PDFs, return them inline
            if (contentType.equals("application/pdf")) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            }

            // For other file types, return a message
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(new org.springframework.core.io.ByteArrayResource(
                            "Preview not available for this file type".getBytes()));

        } catch (IOException e) {
            logger.error("Error previewing file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{filename:.+}")
    public ResponseEntity<?> deleteFile(@PathVariable String filename) {
        try {
            boolean deleted = fileService.deleteFile(filename);
            if (deleted) {
                logger.info("File deleted successfully: {}", filename);
                return ResponseEntity.ok().build();
            } else {
                logger.error("File not found for deletion: {}", filename);
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            logger.error("Error deleting file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete file: " + e.getMessage());
        }
    }
}
