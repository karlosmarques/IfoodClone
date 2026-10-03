package com.ifood.ifood_java.controller.pagamento;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ifood.ifood_java.service.pagamento.PagamentoService;

@RestController
@RequestMapping("/pagamentos")
@CrossOrigin
public class PagamentoController {

    @Autowired
    private PagamentoService pagamentoService;

    // Cria a preferência no Mercado Pago e devolve a URL do Checkout Pro
    @PostMapping("/{pedidoId}/preferencia")
    public ResponseEntity<PagamentoResponse> criarPreferencia(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(pagamentoService.criarPreferencia(pedidoId));
    }

    // Consulta o Mercado Pago e atualiza o status de pagamento do pedido
    @GetMapping("/{pedidoId}/status")
    public ResponseEntity<StatusPagamentoResponse> verificarStatus(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(pagamentoService.verificarPagamento(pedidoId));
    }

    // Webhook do Mercado Pago (só funciona com URL pública, ex: ngrok)
    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "data.id", required = false) String dataId,
            @RequestBody(required = false) Map<String, Object> body) {

        if (dataId == null && body != null && body.get("data") instanceof Map<?, ?> data) {
            Object id = data.get("id");
            dataId = id != null ? id.toString() : null;
        }
        if (type == null && body != null && body.get("type") != null) {
            type = body.get("type").toString();
        }

        if ("payment".equals(type) && dataId != null) {
            pagamentoService.processarNotificacao(Long.parseLong(dataId));
        }

        return ResponseEntity.ok().build();
    }
}
