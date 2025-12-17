package com.ifood.ifood_java.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifood.ifood_java.entity.pedido.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
   List<Pedido> findByClienteIdUsuario(Long idUsuario);
    List<Pedido> findAllByRestauranteIdRestaurante(Long restauranteId);
}
