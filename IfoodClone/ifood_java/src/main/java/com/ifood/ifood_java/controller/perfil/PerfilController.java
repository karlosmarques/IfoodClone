package com.ifood.ifood_java.controller.perfil;

import javax.print.DocFlavor.STRING;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ifood.ifood_java.entity.usuario.Usuario;
import com.ifood.ifood_java.entity.usuario.UsuarioRequest;
import com.ifood.ifood_java.repository.UsuarioRepository;
import com.ifood.ifood_java.service.perfil.PerfilService;


import jakarta.validation.Valid;

@RestController
@RequestMapping("/perfil")
@CrossOrigin
public class PerfilController {

    @Autowired
    private PerfilService perfilService;


    @GetMapping
    public ResponseEntity<MostrarPerfilRequest>pegarPerfil() {
        try {
            MostrarPerfilRequest perfil = perfilService.pegarPerfil();
            return ResponseEntity.ok(perfil);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

   @PutMapping("/editar")
public ResponseEntity<Usuario> atualizarUsuario( @RequestBody Usuario request) {
    Usuario usuario = perfilService.atualizarUsuario(request);
    return ResponseEntity.ok(usuario);
}

}