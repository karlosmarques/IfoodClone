package com.ifood.ifood_java.entity.pedido;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ifood.ifood_java.entity.produtos.Produtos;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter 
@Setter
@NoArgsConstructor 
@AllArgsConstructor
public class PedidoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantidade;

    private BigDecimal subtotal;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_produto")
    private Produtos produto;
}
