package com.ifood.ifood_java.controller.pagamento;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatusPagamentoResponse {
    private Long pedidoId;
    private String pagamentoStatus;
    private String statusPedido;
}
