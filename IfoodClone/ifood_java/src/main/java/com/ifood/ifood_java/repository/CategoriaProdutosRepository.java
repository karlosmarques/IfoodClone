package com.ifood.ifood_java.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ifood.ifood_java.entity.categoria.CategoriaProdutos;

import java.util.Optional;

public interface CategoriaProdutosRepository extends JpaRepository<CategoriaProdutos, Long> {
    Optional<CategoriaProdutos> findByNome(String nome);
}
