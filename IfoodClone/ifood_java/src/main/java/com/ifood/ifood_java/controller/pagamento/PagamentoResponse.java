package com.ifood.ifood_java.controller.pagamento;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PagamentoResponse {
    private Long pedidoId;
    private String preferenceId;
    private String urlPagamento;
}
