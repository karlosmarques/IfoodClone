import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

/* ================= MÁSCARAS ================= */

function maskPhone(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

function maskCNPJ(value) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

/* ================= COMPONENTE ================= */

export default function FormCadastroRest() {
  const location = useLocation();
  const navigate = useNavigate();
  const id_usuario = location.state?.id_usuario;

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [raio, setRaio] = useState("");

  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");

  const [imagem, setImagem] = useState(null);
  const [erro, setErro] = useState("");

  /* ========= CATEGORIAS ========= */
  useEffect(() => {
    async function carregarCategorias() {
      const res = await axios.get("http://localhost:8081/categorias/restaurantes");
      setCategorias(res.data);
    }
    carregarCategorias();
  }, []);

  /* ========= CADASTRAR ========= */
  async function cadastrar() {
    if (
      !nome || !telefone || !cnpj || !raio || !categoriaId ||
      !rua || !numero || !bairro || !cidade || !estado || !cep
    ) {
      return setErro("Preencha todos os campos obrigatórios");
    }

    if (!imagem) {
      return setErro("Envie uma imagem do restaurante");
    }

    try {
      const dados = {
        nome,
        telefone: telefone.replace(/\D/g, ""),
        cnpj: cnpj.replace(/\D/g, ""),
        raio_entrega: raio,
        categoriaId,
        idUsuario: id_usuario,
        endereco: { rua, numero, bairro, cidade, estado, cep },
      };

      const formData = new FormData();
      formData.append(
        "dados",
        new Blob([JSON.stringify(dados)], { type: "application/json" })
      );
      formData.append("imagem", imagem);

      const token = localStorage.getItem("token");

      await axios.post("http://localhost:8081/restaurante", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/telaprincipal");
    } catch (e) {
      setErro("Erro ao cadastrar restaurante");
    }
  }

  /* ================= JSX ================= */

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.titulo}>Cadastro do Restaurante</h1>

        <div style={styles.section}>
          <h3 style={styles.subtitulo}>Dados do restaurante</h3>

          <div style={styles.grid2}>
            <div style={styles.group}>
              <label style={styles.label}>Nome</label>
              <input style={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Telefone</label>
              <input style={styles.input} value={telefone} onChange={(e) => setTelefone(maskPhone(e.target.value))} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>CNPJ</label>
              <input style={styles.input} value={cnpj} onChange={(e) => setCnpj(maskCNPJ(e.target.value))} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Raio de entrega (km)</label>
              <input style={styles.input} value={raio} onChange={(e) => setRaio(e.target.value)} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Categoria</label>
              <select style={styles.input} value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                <option value="">Selecione...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Imagem</label>
              <input type="file" accept="image/*" style={styles.input} onChange={(e) => setImagem(e.target.files[0])} />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subtitulo}>Endereço</h3>

          <div style={styles.grid2}>
            <input style={styles.input} placeholder="Rua" value={rua} onChange={(e) => setRua(e.target.value)} />
            <input style={styles.input} placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
            <input style={styles.input} placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
            <input style={styles.input} placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
            <input style={styles.input} placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
            <input style={styles.input} placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
          </div>
        </div>

        {erro && <div style={styles.erro}>{erro}</div>}

        <button style={styles.btn} onClick={cadastrar}>
          Concluir cadastro
        </button>
      </div>
    </div>
  );
}

/* ================= ESTILOS ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff5f5, #ffecec)",
    padding: "40px 20px",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 20,
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  },
  titulo: {
    textAlign: "center",
    color: "#ea1d2c",
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 30,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  group: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: 6,
    fontWeight: 600,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  erro: {
    backgroundColor: "#ffe5e5",
    padding: 14,
    borderRadius: 12,
    color: "#b30000",
    textAlign: "center",
    marginBottom: 20,
  },
  btn: {
    width: "100%",
    padding: 18,
    backgroundColor: "#ea1d2c",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    fontSize: 18,
    cursor: "pointer",
  },
};
