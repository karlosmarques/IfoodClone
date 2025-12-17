package com.ifood.ifood_java.controller.endereco;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ifood.ifood_java.entity.endereco.Endereco;
import com.ifood.ifood_java.entity.endereco.EnderecoRequest;
import com.ifood.ifood_java.service.endereco.EnderecoService;

@RestController
@RequestMapping("/endereco")
@CrossOrigin
public class EnderecoController {

    @Autowired
    private EnderecoService enderecoService;

    @PutMapping("/editar")
    public ResponseEntity<Endereco> editar(@RequestBody EnderecoRequest request) {
        Endereco endereco = enderecoService.editarEndereco(request);
        return ResponseEntity.ok(endereco);
    }

    @DeleteMapping("/excluir")
    public ResponseEntity<?> excluir() {
        enderecoService.excluirEndereco();
        return ResponseEntity.ok("Endereço excluído com sucesso");
    }

    
}
