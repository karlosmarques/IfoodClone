package com.ifood.ifood_java.service.endereco;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ifood.ifood_java.entity.endereco.Endereco;
import com.ifood.ifood_java.entity.endereco.EnderecoRequest;
import com.ifood.ifood_java.entity.usuario.Usuario;
import com.ifood.ifood_java.repository.EnderecoRepository;
import com.ifood.ifood_java.repository.UsuarioRepository;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;


    public Endereco editarEndereco(EnderecoRequest req) {

        Long userId = getUserIdFromToken();

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Endereco endereco = usuario.getEndereco();

        if (endereco == null) {
            endereco = new Endereco();
            usuario.setEndereco(endereco);
        }

        endereco.setRua(req.getRua());
        endereco.setNumero(req.getNumero());
        endereco.setBairro(req.getBairro());
        endereco.setCidade(req.getCidade());
        endereco.setEstado(req.getEstado());
        endereco.setCep(req.getCep());

        enderecoRepository.save(endereco);
        usuarioRepository.save(usuario);

        return endereco;
    }

    public void excluirEndereco() {

        Long userId = getUserIdFromToken();

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Endereco endereco = usuario.getEndereco();

        if (endereco != null) {
            usuario.setEndereco(null);
            usuarioRepository.save(usuario);
            enderecoRepository.delete(endereco);
        }
    }


    private Long getUserIdFromToken() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if ("anonymousUser".equals(username)) {
            throw new RuntimeException("Usuário não autenticado");
        }

        return Long.parseLong(username);
    }

}
