package com.ifood.ifood_java.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifood.ifood_java.entity.restaurante.Restaurante;
import com.ifood.ifood_java.entity.usuario.Usuario;

public interface RestauranteRepository extends JpaRepository<Restaurante,Long>{

Optional<Restaurante> findById(Long idUsuario);
List<Restaurante> findAllByUsuarioIdUsuario(Long idUsuario);
Optional<Restaurante> findByUsuario(Usuario usuario);
 Optional<Restaurante> findByUsuarioIdUsuario(Long idUsuario);
 List<Restaurante> findAll();


   
}