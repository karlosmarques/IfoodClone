package com.ifood.ifood_java.controller.pedido;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.ifood.ifood_java.entity.pedido.*;
import com.ifood.ifood_java.service.pedido.PedidoService;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;


    @PostMapping
    public ResponseEntity<PedidoResponse> criarPedido(@RequestBody PedidoRequest request) {
        return ResponseEntity.ok(pedidoService.criarPedido(request));
    }


    @GetMapping("/historico/cliente")
    public ResponseEntity<?> historicoCliente() {

        Long userId = Long.parseLong(
            SecurityContextHolder.getContext().getAuthentication().getName()
        );

        return ResponseEntity.ok(pedidoService.historicoCliente(userId));
    }


    @GetMapping("/historico/restaurante")
    public ResponseEntity<?> historicoRestaurante() {
        return ResponseEntity.ok(pedidoService.historicoRestauranteDoUsuario());
    }

    @PutMapping("/{id}/status")
public ResponseEntity<Void> atualizarStatus( @PathVariable Long id,@RequestBody Map<String, String> body) {
    pedidoService.atualizarStatus(id, body.get("status"));
    return ResponseEntity.noContent().build();
}

}
