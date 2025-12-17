package com.ifood.ifood_java.controller.perfil;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MostrarPerfilRequest {

    private String nome;
    
    private String email;
}

