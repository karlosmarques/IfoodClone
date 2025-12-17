package com.ifood.ifood_java.service.upload;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadService {

    private static final String DIRETORIO_UPLOAD = "uploads/";

    public String salvarImagem(MultipartFile file) {

        try {
            File dir = new File(DIRETORIO_UPLOAD);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String nomeOriginal = file.getOriginalFilename();

            // SANITIZAR NOME
            String nomeLimpado = Normalizer.normalize(nomeOriginal, Normalizer.Form.NFD)
                    .replaceAll("[^\\p{ASCII}]", "")     
                    .replaceAll("[^a-zA-Z0-9\\.\\-]", "_"); 

            String nomeArquivo = UUID.randomUUID() + "_" + nomeLimpado;

            Path caminho = Paths.get(DIRETORIO_UPLOAD + nomeArquivo);

            Files.copy(file.getInputStream(), caminho);

           
            return "/uploads/" + nomeArquivo;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar imagem: " + e.getMessage());
        }
    }
}