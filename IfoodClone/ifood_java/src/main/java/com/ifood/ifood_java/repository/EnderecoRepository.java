package com.ifood.ifood_java.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifood.ifood_java.entity.endereco.Endereco;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
}
