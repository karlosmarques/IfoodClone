package com.ifood.ifood_java.entity.senha;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    private String token;
    private String novaSenha;
}
