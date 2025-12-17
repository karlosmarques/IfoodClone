package com.ifood.ifood_java.entity.usuario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import com.ifood.ifood_java.entity.endereco.EnderecoRequest;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Email(message = "Email inválido")
    @NotBlank(message = "Email é obrigatório")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String password;

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "A data deve ser no passado")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate dt_nascimento;

    @NotBlank(message = "celular é obrigatório")    
    private String fone_celular;

    private EnderecoRequest endereco;
}
