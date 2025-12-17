package com.ifood.ifood_java.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ifood.ifood_java.entity.pedido.PedidoItem;

public interface PedidoItemRepository extends JpaRepository<PedidoItem, Long> {

}
