package com.ifood.ifood_java.controller.pedido;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class PedidoResponse {
    private Long id;
    private BigDecimal valorTotal;
    private String status;
    private List<ItemResponse> itens;

    @Data
    public static class ItemResponse {
        private String nomeProduto;
        private Integer quantidade;
        private BigDecimal subtotal;
    }
}
