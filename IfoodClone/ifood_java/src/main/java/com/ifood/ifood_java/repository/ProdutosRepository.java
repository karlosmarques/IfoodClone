package com.ifood.ifood_java.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifood.ifood_java.entity.produtos.Produtos;
import com.ifood.ifood_java.entity.restaurante.Restaurante;


public interface ProdutosRepository extends JpaRepository<Produtos,Long> {
    
   List<Produtos> findAllByRestauranteIdRestaurante(Long restauranteId);
   
   Optional<Produtos> findByNome(String nome);

}
