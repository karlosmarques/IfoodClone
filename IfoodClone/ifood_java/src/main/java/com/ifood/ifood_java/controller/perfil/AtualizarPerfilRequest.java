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
public class AtualizarPerfilRequest {
    private String nome;
    private String email;
    private String cpf;
    private String foneCelular;
    private String dtNascimento;
}

