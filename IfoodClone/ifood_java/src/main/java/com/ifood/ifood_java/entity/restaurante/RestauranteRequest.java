package com.ifood.ifood_java.entity.restaurante;



import org.springframework.web.multipart.MultipartFile;

import com.ifood.ifood_java.entity.endereco.EnderecoRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class RestauranteRequest {

    @NotBlank(message = "Nome do restaurante é obrigatório")
    private String nome;

    @NotBlank(message = "Telefone é obrigatório")
    @Size(min = 10, max = 15, message = "Telefone deve ter entre 10 e 15 caracteres")
    private String telefone;

    @NotBlank(message = "CNPJ é obrigatório")
    @Size(min = 14, max = 18, message = "CNPJ inválido")
    private String cnpj;

    @NotBlank(message = "raio de entrega é obrigatorio")
    private String raio_entrega;

    private String descricao;

    private Long categoriaId;

    private EnderecoRequest endereco;

    private Long idUsuario;

   
}
