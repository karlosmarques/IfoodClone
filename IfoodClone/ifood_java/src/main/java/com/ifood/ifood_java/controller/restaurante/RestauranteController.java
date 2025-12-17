package com.ifood.ifood_java.controller.restaurante;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.ifood.ifood_java.entity.restaurante.Restaurante;
import com.ifood.ifood_java.entity.restaurante.RestauranteRequest;
import com.ifood.ifood_java.service.restaurante.RestauranteService;

import jakarta.validation.Valid;



@Controller
@RequestMapping("/restaurante")
@CrossOrigin
public class RestauranteController {
    
    @Autowired
    private RestauranteService restauranteService;

@PostMapping(consumes = {"multipart/form-data"})
public ResponseEntity<Restaurante> criarRestaurante(@RequestPart("dados") RestauranteRequest request,@RequestPart("imagem") MultipartFile imagem){
    Restaurante restaurante = restauranteService.criarRestaurante(request, imagem);
    return ResponseEntity.ok(restaurante);
}



    @GetMapping
    public ResponseEntity<?> mostrarRestaurante(){
    var resultado = restauranteService.mostrarRestaurante();
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarRestaurante(@PathVariable Long id) {
    restauranteService.deletarRestaurante(id);
    return ResponseEntity.noContent().build();
}

@GetMapping("/usuario/{idUsuario}")
public ResponseEntity<?> buscarPorUsuario(@PathVariable Long idUsuario) {
    Restaurante restaurante = restauranteService.buscarPorUsuario(idUsuario);
    if (restaurante == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(restaurante);
}

 @PutMapping("/editar")
    public ResponseEntity<?> atualizarRestaurante(@RequestBody Restaurante request) {
        var atualizado = restauranteService.atualizarRestauranteDoUsuario(request);
        return ResponseEntity.ok(atualizado);
    }


    //mobile

    @GetMapping("/mobile")
    public ResponseEntity<List<Restaurante>> listarTodos() {
        return ResponseEntity.ok(restauranteService.listarTodos());
    }

    // ROTA DE DETALHE DO RESTAURANTE
    @GetMapping("/{id}")
    public Restaurante buscarPorId(@PathVariable Long id) {
        return restauranteService.buscarPorId(id);
    }

    
}


