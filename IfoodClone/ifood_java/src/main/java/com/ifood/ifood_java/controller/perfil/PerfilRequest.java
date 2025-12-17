package com.ifood.ifood_java.controller.perfil;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PerfilRequest {
    private Long idUsuario;
    private String nome;
    private String email;
    private String cpf;
    private LocalDate dtNascimento;
    private String foneCelular;
}


