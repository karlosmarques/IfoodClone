package com.ifood.ifood_java.entity.restaurante;


import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.ifood.ifood_java.entity.categoria.CategoriaRestaurante;
import com.ifood.ifood_java.entity.endereco.Endereco;
import com.ifood.ifood_java.entity.pedido.Pedido;
import com.ifood.ifood_java.entity.produtos.Produtos;
import com.ifood.ifood_java.entity.usuario.Usuario;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Restaurante {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "id_restaurante")
   private Long idRestaurante;

   @Column(name = "nome")
   private String nome;

   @Column(name = "telefone")
   private String telefone;

   @Column(name = "cnpj")
   private String cnpj;

   @Column(name = "raio_entrega")
   private String raio_entrega;

   @ManyToOne
   @JoinColumn(name = "categoria_id")
   @JsonIgnoreProperties("restaurantes")
   private CategoriaRestaurante categoria;

   @OneToOne
   @JoinColumn(name = "id_usuario", nullable = false) 
   private Usuario usuario;

   @OneToOne(cascade = CascadeType.ALL)
   @JoinColumn(name = "endereco_id", referencedColumnName = "id")
   private Endereco endereco;

   private String urlImagem;

   @OneToMany(mappedBy = "restaurante", cascade = CascadeType.ALL, orphanRemoval = true)
   @JsonIgnore
   private List<Produtos> produtos;

   @OneToMany(mappedBy = "restaurante", cascade = CascadeType.ALL, orphanRemoval = true)
   @JsonIgnore
   private List<Pedido> pedidos = new ArrayList<>();
}