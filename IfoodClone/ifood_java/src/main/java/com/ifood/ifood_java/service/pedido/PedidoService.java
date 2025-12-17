package com.ifood.ifood_java.service.pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ifood.ifood_java.controller.pedido.PedidoRequest;
import com.ifood.ifood_java.controller.pedido.PedidoResponse;
import com.ifood.ifood_java.entity.pedido.*;
import com.ifood.ifood_java.entity.produtos.Produtos;
import com.ifood.ifood_java.entity.restaurante.Restaurante;
import com.ifood.ifood_java.entity.usuario.Usuario;
import com.ifood.ifood_java.repository.*;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PedidoItemRepository pedidoItemRepository;

    @Autowired
    private ProdutosRepository produtosRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RestauranteRepository restauranteRepository;


    public PedidoResponse criarPedido(PedidoRequest request) {

        Long userId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );

        Usuario cliente = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Restaurante restaurante = restauranteRepository.findById(request.getIdRestaurante())
                .orElseThrow(() -> new RuntimeException("Restaurante não encontrado"));


        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setRestaurante(restaurante);
        pedido.setDataCriacao(LocalDateTime.now());
        pedido.setStatus("REALIZADO");

        List<PedidoItem> itensEntities = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;


        for (PedidoRequest.ItemRequest item : request.getItens()) {

            Produtos produto = produtosRepository.findById(item.getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            BigDecimal subtotal = produto.getPreco().multiply(BigDecimal.valueOf(item.getQuantidade()));

            total = total.add(subtotal);

            PedidoItem itemEntity = new PedidoItem();
            itemEntity.setProduto(produto);
            itemEntity.setQuantidade(item.getQuantidade());
            itemEntity.setSubtotal(subtotal);
            itemEntity.setPedido(pedido);

            itensEntities.add(itemEntity);
        }

        pedido.setValorTotal(total);
        pedido.setItens(itensEntities);

        pedidoRepository.save(pedido);
        pedidoItemRepository.saveAll(itensEntities);

        return buildResponse(pedido);
    }


    private PedidoResponse buildResponse(Pedido pedido) {
        PedidoResponse resp = new PedidoResponse();
        resp.setId(pedido.getId());
        resp.setValorTotal(pedido.getValorTotal());
        resp.setStatus(pedido.getStatus());

        List<PedidoResponse.ItemResponse> itens = new ArrayList<>();

        for (PedidoItem i : pedido.getItens()) {
            PedidoResponse.ItemResponse ir = new PedidoResponse.ItemResponse();
            ir.setNomeProduto(i.getProduto().getNome());
            ir.setQuantidade(i.getQuantidade());
            ir.setSubtotal(i.getSubtotal());
            itens.add(ir);
        }

        resp.setItens(itens);

        return resp;
    }


    
    public List<Pedido> historicoCliente(Long clienteId) {
        return pedidoRepository.findByClienteIdUsuario(clienteId);
    }

   
 public List<Pedido> historicoRestauranteDoUsuario() {

        Long userId = Long.parseLong(
            SecurityContextHolder.getContext().getAuthentication().getName()
        );
        Restaurante restaurante = restauranteRepository
                .findByUsuarioIdUsuario(userId)
                .orElseThrow(() -> new RuntimeException("Restaurante não encontrado para este usuário"));

        return pedidoRepository.findAllByRestauranteIdRestaurante(
                restaurante.getIdRestaurante()
        );
    }

    public void atualizarStatus(Long id, String status) {
    Pedido pedido = pedidoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

    pedido.setStatus(status);
    pedidoRepository.save(pedido);
}


    

}
