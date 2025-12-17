package com.ifood.ifood_java.controller.upload;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ifood.ifood_java.service.upload.UploadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
@CrossOrigin
public class UploadController {

    private UploadService uploadService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<String> uploadImagem(@RequestParam("file") MultipartFile file) {
        String path = uploadService.salvarImagem(file);
        return ResponseEntity.ok(path);
    }
}

