package com.ifood.ifood_java.entity.senha;

import java.time.LocalDateTime;

import com.ifood.ifood_java.entity.usuario.Usuario;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private LocalDateTime expiracao;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
