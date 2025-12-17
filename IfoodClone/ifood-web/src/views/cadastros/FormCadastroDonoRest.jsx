import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ========= MÁSCARAS ========= */

function maskCPF(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function maskPhone(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

export default function FormCadastroDonoRest({ onBackToLogin }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [fone, setFone] = useState("");
  const [dtNascimento, setDtNascimento] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [erro, setErro] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  async function cadastrar() {
    const cpfNumeros = cpf.replace(/\D/g, "");
    const foneNumeros = fone.replace(/\D/g, "");

    if (
      !nome || !cpf || !email || !password || !fone ||
      !dtNascimento || !rua || !numero || !bairro ||
      !cidade || !estado || !cep
    ) {
      return setErro("Preencha todos os campos");
    }

    if (!email.includes("@")) return setErro("O e-mail deve conter @");
    if (cpfNumeros.length !== 11) return setErro("CPF deve ter 11 dígitos");
    if (foneNumeros.length !== 11) return setErro("Telefone inválido");
    if (password.length < 6) return setErro("Senha deve ter no mínimo 6 caracteres");
    if (password !== repPassword) return setErro("As senhas devem ser iguais");

    setErro("");

    const payload = {
      nome,
      cpf: cpfNumeros,
      email,
      password,
      dt_nascimento: dtNascimento,
      fone_celular: foneNumeros,
      endereco: {
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
      },
    };

    try {
      await axios.post("http://localhost:8081/auth/registro", payload);
      onBackToLogin();
    } catch (e) {
      console.log(e);
      setErro("Erro ao cadastrar usuário");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.titulo}>Cadastro do Usuário</h1>

        <div style={styles.section}>
          <h3 style={styles.subtitulo}>Dados pessoais</h3>

          <div style={styles.grid2}>
            <div style={styles.group}>
              <label style={styles.label}>Nome completo</label>
              <input style={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>CPF</label>
              <input
                style={styles.input}
                value={cpf}
                onChange={(e) => setCpf(maskCPF(e.target.value))}
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>E-mail</label>
              <input style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Telefone</label>
              <input
                style={styles.input}
                value={fone}
                onChange={(e) => setFone(maskPhone(e.target.value))}
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Data de nascimento</label>
              <input
                style={styles.input}
                type="date"
                value={dtNascimento}
                onChange={(e) => setDtNascimento(e.target.value)}
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Senha</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Repetir senha</label>
              <input
                style={styles.input}
                type="password"
                value={repPassword}
                onChange={(e) => setRepPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subtitulo}>Endereço</h3>

          <div style={styles.grid2}>
            <div style={styles.group}>
              <label style={styles.label}>Rua</label>
              <input style={styles.input} value={rua} onChange={(e) => setRua(e.target.value)} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Número</label>
              <input style={styles.input} value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Bairro</label>
              <input style={styles.input} value={bairro} onChange={(e) => setBairro(e.target.value)} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Cidade</label>
              <input style={styles.input} value={cidade} onChange={(e) => setCidade(e.target.value)} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Estado</label>
              <input style={styles.input} value={estado} onChange={(e) => setEstado(e.target.value)} />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>CEP</label>
              <input style={styles.input} value={cep} onChange={(e) => setCep(e.target.value)} />
            </div>
          </div>
        </div>

        {erro && <div style={styles.erro}>{erro}</div>}

        <button style={styles.btn} onClick={cadastrar}>
          Cadastrar
        </button>

        <button style={styles.voltar} onClick={onBackToLogin}>
          ← Voltar ao login
        </button>
      </div>
    </div>
  );
}

/* ========= STYLES ========= */

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
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
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
    color: "#333",
  },
  section: { marginBottom: 30 },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  group: { display: "flex", flexDirection: "column" },
  label: { marginBottom: 6, fontWeight: 600, color: "#444" },
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
  voltar: {
    width: "100%",
    marginTop: 16,
    padding: 12,
    background: "none",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    color: "#555",
    textDecoration: "underline",
  },
};
