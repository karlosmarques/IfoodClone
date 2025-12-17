package com.ifood.ifood_java.entity.pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.ifood.ifood_java.entity.restaurante.Restaurante;
import com.ifood.ifood_java.entity.usuario.Usuario;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal valorTotal;

    private LocalDateTime dataCriacao;

    private String status; 

    @Column(name = "pagamento_status")
    private String pagamentoStatus;

    @Column(name = "metodo_pagamento")
    private String metodoPagamento;
    
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "id_restaurante")
    private Restaurante restaurante;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<PedidoItem> itens;
}
