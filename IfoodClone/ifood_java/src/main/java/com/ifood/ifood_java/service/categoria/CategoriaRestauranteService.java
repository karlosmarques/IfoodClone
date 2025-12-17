package com.ifood.ifood_java.service.categoria;

import com.ifood.ifood_java.entity.categoria.CategoriaRestaurante;
import com.ifood.ifood_java.repository.CategoriaRestauranteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaRestauranteService {

    private final CategoriaRestauranteRepository repository;

    public CategoriaRestauranteService(CategoriaRestauranteRepository repository) {
        this.repository = repository;
    }

    public List<CategoriaRestaurante> listarTodos() {
        return repository.findAll();
    }

    public CategoriaRestaurante salvar(CategoriaRestaurante categoria) {
        return repository.save(categoria);
    }

    public CategoriaRestaurante atualizar(Long id, CategoriaRestaurante categoria) {

        // Agora funciona, porque findById() retorna Optional corretamente
        CategoriaRestaurante existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        existente.setNome(categoria.getNome());

        return repository.save(existente);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
