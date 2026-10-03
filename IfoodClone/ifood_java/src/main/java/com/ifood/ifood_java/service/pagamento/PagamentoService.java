package com.ifood.ifood_java.service.pagamento;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ifood.ifood_java.controller.pagamento.PagamentoResponse;
import com.ifood.ifood_java.controller.pagamento.StatusPagamentoResponse;
import com.ifood.ifood_java.entity.pedido.Pedido;
import com.ifood.ifood_java.entity.pedido.PedidoItem;
import com.ifood.ifood_java.repository.PedidoRepository;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.net.MPResultsResourcesPage;
import com.mercadopago.net.MPSearchRequest;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;

@Service
public class PagamentoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Value("${mercadopago.notification-url:}")
    private String notificationUrl;

    @Value("${mercadopago.back-url:}")
    private String backUrl;


    public PagamentoResponse criarPreferencia(Long pedidoId) {

        Pedido pedido = buscarPedidoDoUsuario(pedidoId);

        if ("APROVADO".equals(pedido.getPagamentoStatus())) {
            throw new RuntimeException("Este pedido já foi pago");
        }

        List<PreferenceItemRequest> itens = new ArrayList<>();

        for (PedidoItem item : pedido.getItens()) {
            BigDecimal precoUnitario = item.getSubtotal()
                    .divide(BigDecimal.valueOf(item.getQuantidade()), 2, RoundingMode.HALF_UP);

            itens.add(PreferenceItemRequest.builder()
                    .id(String.valueOf(item.getProduto().getIdProduto()))
                    .title(item.getProduto().getNome())
                    .quantity(item.getQuantidade())
                    .currencyId("BRL")
                    .unitPrice(precoUnitario)
                    .build());
        }

        PreferenceRequest.PreferenceRequestBuilder builder = PreferenceRequest.builder()
                .items(itens)
                .externalReference(String.valueOf(pedido.getId()))
                .statementDescriptor("IFOOD CLONE");

        if (!notificationUrl.isBlank()) {
            builder.notificationUrl(notificationUrl);
        }

        if (!backUrl.isBlank()) {
            builder.backUrls(PreferenceBackUrlsRequest.builder()
                    .success(backUrl)
                    .pending(backUrl)
                    .failure(backUrl)
                    .build());
        }

        try {
            Preference preference = new PreferenceClient().create(builder.build());

            // Credenciais "TEST-" usam o sandbox; credenciais de usuário de teste usam o init_point normal
            String url = accessToken.startsWith("TEST-")
                    ? preference.getSandboxInitPoint()
                    : preference.getInitPoint();

            pedido.setPagamentoStatus("PENDENTE");
            pedidoRepository.save(pedido);

            return new PagamentoResponse(pedido.getId(), preference.getId(), url);

        } catch (MPApiException e) {
            throw new RuntimeException("Erro no Mercado Pago: " + e.getApiResponse().getContent(), e);
        } catch (MPException e) {
            throw new RuntimeException("Erro ao criar pagamento: " + e.getMessage(), e);
        }
    }


    public StatusPagamentoResponse verificarPagamento(Long pedidoId) {

        Pedido pedido = buscarPedidoDoUsuario(pedidoId);

        try {
            Map<String, Object> filtros = new HashMap<>();
            filtros.put("external_reference", String.valueOf(pedido.getId()));

            MPResultsResourcesPage<Payment> resultado = new PaymentClient().search(
                    MPSearchRequest.builder().filters(filtros).limit(50).offset(0).build());

            String statusMp = null;

            for (Payment pagamento : resultado.getResults()) {
                if ("approved".equals(pagamento.getStatus())) {
                    statusMp = "approved";
                    break;
                }
                // Se nenhum estiver aprovado, fica com o último status encontrado
                statusMp = pagamento.getStatus();
            }

            if (statusMp != null) {
                aplicarStatus(pedido, statusMp);
            }

        } catch (MPApiException e) {
            throw new RuntimeException("Erro no Mercado Pago: " + e.getApiResponse().getContent(), e);
        } catch (MPException e) {
            throw new RuntimeException("Erro ao consultar pagamento: " + e.getMessage(), e);
        }

        return new StatusPagamentoResponse(pedido.getId(), pedido.getPagamentoStatus(), pedido.getStatus());
    }


    public void processarNotificacao(Long paymentId) {
        try {
            Payment pagamento = new PaymentClient().get(paymentId);

            if (pagamento.getExternalReference() == null) return;

            Long pedidoId = Long.parseLong(pagamento.getExternalReference());

            pedidoRepository.findById(pedidoId)
                    .ifPresent(pedido -> aplicarStatus(pedido, pagamento.getStatus()));

        } catch (MPApiException | MPException | NumberFormatException e) {
            System.err.println("Falha ao processar notificação do Mercado Pago: " + e.getMessage());
        }
    }


    private void aplicarStatus(Pedido pedido, String statusMp) {

        // Pagamento aprovado não volta atrás
        if ("APROVADO".equals(pedido.getPagamentoStatus())) return;

        switch (statusMp) {
            case "approved", "authorized" -> {
                pedido.setPagamentoStatus("APROVADO");
                pedido.setStatus("REALIZADO");
            }
            case "rejected", "cancelled", "refunded", "charged_back" ->
                pedido.setPagamentoStatus("RECUSADO");
            default ->
                pedido.setPagamentoStatus("PENDENTE");
        }

        pedidoRepository.save(pedido);
    }


    private Pedido buscarPedidoDoUsuario(Long pedidoId) {

        Long userId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (!pedido.getCliente().getIdUsuario().equals(userId)) {
            throw new RuntimeException("Este pedido não pertence ao usuário logado");
        }

        return pedido;
    }
}
