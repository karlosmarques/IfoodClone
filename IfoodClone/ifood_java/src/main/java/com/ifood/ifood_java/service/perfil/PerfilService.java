package com.ifood.ifood_java.service.perfil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ifood.ifood_java.controller.perfil.AtualizarPerfilRequest;
import com.ifood.ifood_java.controller.perfil.MostrarPerfilRequest;
import com.ifood.ifood_java.entity.usuario.Usuario;
import com.ifood.ifood_java.entity.usuario.UsuarioRequest;
import com.ifood.ifood_java.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class PerfilService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;


    public MostrarPerfilRequest pegarPerfil() {
       
        Long userId = Long.parseLong(
        SecurityContextHolder.getContext().getAuthentication().getName()
    );
        
         Usuario usuario = usuarioRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return new MostrarPerfilRequest(
            usuario.getNome(),
            usuario.getEmail()
        );
        
    }
    public Usuario atualizarUsuario(Usuario request) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(username);

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setCpf(request.getCpf());
        usuario.setFoneCelular(request.getFoneCelular());
        usuario.setDtNascimento(request.getDtNascimento());

        return usuarioRepository.save(usuario);
    }
}