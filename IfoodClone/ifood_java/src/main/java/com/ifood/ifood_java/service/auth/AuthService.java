package com.ifood.ifood_java.service.auth;
import com.ifood.ifood_java.entity.usuario.UsuarioRequest;
import com.ifood.ifood_java.infra.security.TokenService;

import java.util.List;
import java.util.Optional;
import com.ifood.ifood_java.controller.auth.LoginRequest;
import com.ifood.ifood_java.controller.auth.ResponseLoginRequest;
import com.ifood.ifood_java.entity.endereco.Endereco;
import com.ifood.ifood_java.entity.usuario.Usuario;
import com.ifood.ifood_java.repository.UsuarioRepository;
import com.ifood.ifood_java.service.email.EmailService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class AuthService {

   
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private EmailService emailService;


    public String registrarUsuario(UsuarioRequest request) {
    
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        Endereco endereco = new Endereco();
        endereco.setRua(request.getEndereco().getRua());
        endereco.setNumero(request.getEndereco().getNumero());
        endereco.setBairro(request.getEndereco().getBairro());
        endereco.setCidade(request.getEndereco().getCidade());
        endereco.setEstado(request.getEndereco().getEstado());
        endereco.setCep(request.getEndereco().getCep());

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setCpf(request.getCpf());
        usuario.setFoneCelular(request.getFone_celular());
        usuario.setDtNascimento((request.getDt_nascimento()));
        usuario.setEndereco(endereco);

        usuarioRepository.save(usuario);

        return "Usuário registrado com sucesso";
    }

 public ResponseLoginRequest login(LoginRequest request) {

    Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
        throw new RuntimeException("Senha inválida");
    }

    
    String token = tokenService.gerarToken(usuario);

    return new ResponseLoginRequest(
            token,
            "Bearer",
            usuario.getIdUsuario(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getCpf(),
            usuario.getDtNascimento(),
            usuario.getFoneCelular()
    );
}

public void forgotPassword(String email) {

        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);

     
        if (userOpt.isEmpty()) {
            return;
        }

        Usuario user = userOpt.get();

        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setResetTokenExpira(LocalDateTime.now().plusMinutes(15));

        usuarioRepository.save(user);

        String link = "http://localhost:3000/trocar-senha?token=" + token;

        String html = """
            <h2>Redefinição de senha</h2>
            <p>Clique no link abaixo:</p>
            <a href="%s">Redefinir senha</a>
            <p>Este link expira em 15 minutos.</p>
        """.formatted(link);

        emailService.enviarEmail(user.getEmail(), "Redefinir senha", html);
    }

  public void resetPassword(String token, String novaSenha) {
    
    Optional<Usuario> userOpt = usuarioRepository.findTop1ByResetToken(token);

    if (userOpt.isEmpty()) {
        throw new RuntimeException("Token inválido");
    }

    Usuario user = userOpt.get();

    
    if (user.getResetTokenExpira() == null || user.getResetTokenExpira().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Token expirado");
    }

    
    user.setPassword(passwordEncoder.encode(novaSenha));

   
    user.setResetToken(null);
    user.setResetTokenExpira(null);

    usuarioRepository.save(user);

    System.out.println("Senha redefinida com sucesso para o usuário: " + user.getEmail());
}

}



    