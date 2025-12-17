package com.ifood.ifood_java.service.restaurante;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ifood.ifood_java.entity.categoria.CategoriaRestaurante;
import com.ifood.ifood_java.entity.endereco.Endereco;
import com.ifood.ifood_java.entity.restaurante.Restaurante;
import com.ifood.ifood_java.entity.restaurante.RestauranteRequest;
import com.ifood.ifood_java.entity.usuario.Usuario;
import com.ifood.ifood_java.repository.CategoriaRestauranteRepository;
import com.ifood.ifood_java.repository.RestauranteRepository;
import com.ifood.ifood_java.repository.UsuarioRepository;
import com.ifood.ifood_java.service.upload.UploadService;

@Service
public class RestauranteService {
    
    @Autowired
    private RestauranteRepository restauranteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UploadService uploadService;

    @Autowired
    private CategoriaRestauranteRepository categoriaRestauranteRepository;

    // Obtém o ID do usuário logado, retorna null se não autenticado
    private Long getLoggedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return null; // usuário não autenticado
        }
        // Nota: Pressupõe que auth.getName() armazena o ID do usuário como String.
        return Long.parseLong(auth.getName()); 
    }

    public Restaurante criarRestaurante(RestauranteRequest request, MultipartFile imagem) {
        Long userId = getLoggedUserId();
        if (userId == null) {
            // Mantendo a exceção neste método, pois a criação DEVE ter um usuário logado.
            throw new RuntimeException("Usuário não autenticado"); 
        }

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        CategoriaRestaurante categoria = categoriaRestauranteRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Endereco endereco = new Endereco();
        endereco.setRua(request.getEndereco().getRua());
        endereco.setNumero(request.getEndereco().getNumero());
        endereco.setBairro(request.getEndereco().getBairro());
        endereco.setCidade(request.getEndereco().getCidade());
        endereco.setEstado(request.getEndereco().getEstado());
        endereco.setCep(request.getEndereco().getCep());

        Restaurante restaurante = new Restaurante();
        restaurante.setNome(request.getNome());
        restaurante.setTelefone(request.getTelefone());
        restaurante.setCnpj(request.getCnpj());
        restaurante.setRaio_entrega(request.getRaio_entrega());
        restaurante.setCategoria(categoria);
        restaurante.setEndereco(endereco);
        restaurante.setUsuario(usuario);

        if (imagem != null && !imagem.isEmpty()) {
            String caminho = uploadService.salvarImagem(imagem);
            restaurante.setUrlImagem(caminho);
        }

        restauranteRepository.save(restaurante);

        return restaurante;
    }
    public List<Restaurante> mostrarRestaurante() {
        Long userId = getLoggedUserId();
        if (userId == null) { 
            return null; 
        }
        
        return restauranteRepository.findAllByUsuarioIdUsuario(userId);
    }

    public void deletarRestaurante(Long id) {
        if (!restauranteRepository.existsById(id)) {
            throw new RuntimeException("Restaurante não encontrado");
        }
        restauranteRepository.deleteById(id);
    }

    public Restaurante buscarPorUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return restauranteRepository.findByUsuario(usuario).orElse(null);
    }

    public Restaurante atualizarRestauranteDoUsuario(Restaurante request) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(username);

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Restaurante restaurante = restauranteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Restaurante não encontrado"));

        restaurante.setNome(request.getNome());
        restaurante.setTelefone(request.getTelefone());
        restaurante.setCnpj(request.getCnpj());
        restaurante.setRaio_entrega(request.getRaio_entrega());
        restaurante.setUrlImagem(request.getUrlImagem());

        return restauranteRepository.save(restaurante);
    }

    // mobile
    public List<Restaurante> listarTodos() {
        return restauranteRepository.findAll();
    }

    public Restaurante buscarPorId(Long id) {
        return restauranteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurante não encontrado"));
    }
}
