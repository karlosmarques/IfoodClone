
package com.ifood.ifood_java.controller.pedido;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PedidoRequest {

    private Long idRestaurante;

    private List<ItemRequest> itens;

    @Data
    public static class ItemRequest {
        private Long idProduto;
        private Integer quantidade;
    }
}
