package com.example.filemanager.service;

import com.example.filemanager.model.FileMetadata;
import com.example.filemanager.repository.FileMetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        "txt", "pdf","jpg", "jpeg", "png", "json"
    );

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }

    public FileMetadata saveFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IOException("File name cannot be null");
        }

        String extension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IOException("File type not allowed. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        String filename = originalFilename;
        int counter = 1;
        
        // Check if file exists and append number if it does
        while (fileMetadataRepository.findByFilename(filename) != null) {
            String nameWithoutExtension = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
            String ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
            filename = nameWithoutExtension + "(" + counter + ")" + ext;
            counter++;
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        FileMetadata metadata = new FileMetadata();
        metadata.setFilename(filename);
        metadata.setOriginalFilename(originalFilename);
        metadata.setFileType(file.getContentType());
        metadata.setSize(file.getSize());
        metadata.setStoragePath(filePath.toString());
        metadata.setUploadTime(LocalDateTime.now());

        return fileMetadataRepository.save(metadata);
    }

    public List<FileMetadata> listFiles() {
        return fileMetadataRepository.findAll();
    }

    public Path getFile(String filename) {
        FileMetadata metadata = fileMetadataRepository.findByFilename(filename);
        if (metadata != null) {
            return Paths.get(metadata.getStoragePath());
        }
        return null;
    }

    public boolean deleteFile(String filename) throws IOException {
        FileMetadata metadata = fileMetadataRepository.findByFilename(filename);
        if (metadata == null) {
            return false;
        }

        Path filePath = Paths.get(metadata.getStoragePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        
        fileMetadataRepository.delete(metadata);
        return true;
    }
}
