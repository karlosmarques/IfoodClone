package com.ifood.ifood_java.controller.auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifood.ifood_java.entity.usuario.Usuario;
import com.ifood.ifood_java.entity.usuario.UsuarioRequest;
import com.ifood.ifood_java.infra.security.TokenService;
import com.ifood.ifood_java.repository.UsuarioRepository;
import com.ifood.ifood_java.service.auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/registro")
    public ResponseEntity<String> criar(@RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(authService.registrarUsuario(request));
    }

@PostMapping("/login")
public ResponseEntity<ResponseLoginRequest> login(@RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
}

 @PostMapping("/esqueceu-senha")
    public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> body) {
        authService.forgotPassword(body.get("email"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/trocar-senha")
    public ResponseEntity<Void> resetPassword(@RequestBody Map<String, String> body) {
        authService.resetPassword(
                body.get("token"),
                body.get("senha")
        );
        return ResponseEntity.ok().build();
    }
    
}
