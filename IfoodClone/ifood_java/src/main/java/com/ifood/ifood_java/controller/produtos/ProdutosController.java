package com.ifood.ifood_java.controller.produtos;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.ifood.ifood_java.entity.produtos.Produtos;
import com.ifood.ifood_java.entity.produtos.ProdutosRequest;
import com.ifood.ifood_java.service.produto.ProdutoService;
import com.ifood.ifood_java.service.restaurante.RestauranteService;

@Controller
@RequestMapping("/produtos")
@CrossOrigin
public class ProdutosController {

    @Autowired
    private ProdutoService produtoService;

   @PostMapping(value = "/criar", consumes = {"multipart/form-data"})
public ResponseEntity<Produtos> criarProdutos(@RequestPart("dados") ProdutosRequest request,@RequestPart(value = "imagem", required = false) MultipartFile imagem) {
    Produtos produto = produtoService.criarProdutos(request, imagem);
    return ResponseEntity.ok(produto);
}


    @GetMapping
    public ResponseEntity<?>mostrarProdutos(){
        var resultado = produtoService.mostrarProdutos();
        return ResponseEntity.ok(resultado);
    }

  @GetMapping("/restaurante/{idRestaurante}")
public ResponseEntity<List<Produtos>> listarPorRestaurante(@PathVariable Long idRestaurante) {
    List<Produtos> produtos = produtoService.listarProdutosPorRestaurante(idRestaurante);
    return ResponseEntity.ok(produtos);
}

@GetMapping("/detalhe/{produtoId}")
public ResponseEntity<Produtos> buscarProduto(@PathVariable Long produtoId) {
    Produtos produto = produtoService.buscarProdutoPorId(produtoId);
    return ResponseEntity.ok(produto);
}
   
@PutMapping("/editar/{id}")
public ResponseEntity<Produtos>editarProduto(@RequestBody ProdutosRequest request, @PathVariable Long id) {
    Produtos produtos = produtoService.editarProduto(request,id);
    return ResponseEntity.ok(produtos);
}

@DeleteMapping("/deletar/{id}")
public ResponseEntity<Void>deletarProduto(@PathVariable Long id) {
    produtoService.deletarProduto(id);
    return ResponseEntity.noContent().build();
}

}
