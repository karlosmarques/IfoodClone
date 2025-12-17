package com.ifood.ifood_java.controller.categoriaRestaurante;

import com.ifood.ifood_java.entity.categoria.CategoriaRestaurante;
import com.ifood.ifood_java.service.categoria.CategoriaRestauranteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/categorias/restaurantes")
public class CategoriaRestauranteController {

    private final CategoriaRestauranteService service;

    public CategoriaRestauranteController(CategoriaRestauranteService service) {
        this.service = service;
    }

    @GetMapping
    public List<CategoriaRestaurante> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public CategoriaRestaurante salvar(@RequestBody CategoriaRestaurante categoria) {
        return service.salvar(categoria);
    }

    @PutMapping("/{id}")
    public CategoriaRestaurante atualizar(@PathVariable Long id, @RequestBody CategoriaRestaurante categoria) {
        return service.atualizar(id, categoria);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
