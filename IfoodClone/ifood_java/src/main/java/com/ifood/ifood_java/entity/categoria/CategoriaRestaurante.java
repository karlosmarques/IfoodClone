package com.ifood.ifood_java.entity.categoria;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;


import com.ifood.ifood_java.entity.restaurante.Restaurante;

@Entity
@Data

public class CategoriaRestaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
     private String urlImagem;
    
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    private List<Restaurante> restaurantes;
    
}
