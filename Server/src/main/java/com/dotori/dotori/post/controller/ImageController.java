package com.dotori.dotori.post.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@Log4j2
@RequestMapping("/api/images")
public class ImageController {

    private final Path fileStorageLocation;

    public ImageController() {
        this.fileStorageLocation = Paths.get(System.getProperty("user.home") + "/dotori/images").toAbsolutePath().normalize();
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            log.info("Attempting to load image: " + filePath);
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                String contentType = determineContentType(resource);
                log.info("Image found. Content type: " + contentType);
                log.info("File size: " + resource.contentLength() + " bytes");
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                log.warn("Image not found: " + filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            log.error("Error serving image: " + filename, ex);
            return ResponseEntity.internalServerError().build();
        }
    }

    private String determineContentType(Resource resource) throws IOException {
        String filename = resource.getFilename();
        if (filename != null) {
            if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                return "image/jpeg";
            } else if (filename.endsWith(".png")) {
                return "image/png";
            } else if (filename.endsWith(".gif")) {
                return "image/gif";
            }
        }
        return "application/octet-stream";
    }
}